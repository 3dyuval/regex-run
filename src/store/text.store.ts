import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { generateTargets, type Target, type RegexFeature } from '@/components/regex-game/regex-features';

interface TextAPI {
  key: string;
  url: string;
  parser: (data: any) => string;
}

const TEXT_APIS: TextAPI[] = [
  { key: 'quotable', url: 'https://api.quotable.io/random?minLength=100&maxLength=300', parser: (data) => data.content },
  { key: 'uselessfacts', url: 'https://uselessfacts.jsph.pl/api/v2/facts/random', parser: (data) => data.text },
  { key: 'chucknorris', url: 'https://api.chucknorris.io/jokes/random', parser: (data) => data.value },
  { key: 'adviceslip', url: 'https://api.adviceslip.com/advice', parser: (data) => data.slip.advice },
  { key: 'catfact', url: 'https://catfact.ninja/fact', parser: (data) => data.fact },
  { key: 'jokes', url: 'https://official-joke-api.appspot.com/random_joke', parser: (data) => `${data.setup} ${data.punchline}` }
];

const FALLBACK_TEXT = 'The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do. Numbers like 123 and 456 are important. Characters repeat sometimes, like ooooh or ahhhh!';

export const useTextStore = defineStore('text', () => {
  const text = useLocalStorage('regex-game-text', '');
  const targets = useLocalStorage<Target[]>('regex-game-targets', []);
  const currentFeatures = useLocalStorage<RegexFeature[]>('regex-game-features', []);
  const isLoading = ref(false);

  const _textCache = useLocalStorage<Record<string, string[]>>('regex-game-cache', {});
  const _seenTexts = useLocalStorage<string[]>('regex-game-seen', []);

  const textCache = computed({
    get: () => _textCache.value,
    set: (newEntries: Record<string, string[]>) => {
      const updated = { ..._textCache.value };
      for (const [key, texts] of Object.entries(newEntries)) {
        const existing = updated[key] || [];
        updated[key] = [...new Set([...existing, ...texts])];
      }
      _textCache.value = updated;
    }
  });

  const allCachedTexts = computed(() => Object.values(_textCache.value).flat());

  const unseenTexts = computed(() => {
    const seen = new Set(_seenTexts.value);
    return allCachedTexts.value.filter(t => !seen.has(t));
  });

  const allTextsSeen = computed(() =>
    allCachedTexts.value.length > 0 && unseenTexts.value.length === 0
  );

  function markText() {
    if (text.value && !_seenTexts.value.includes(text.value)) {
      _seenTexts.value = [...new Set([..._seenTexts.value, text.value])];
    }
  }

  function addToCache(key: string, newText: string) {
    if (!newText || newText.length < 50) return;
    textCache.value = { [key]: [newText] };
  }

  function getUnseenFromCache(): string | null {
    if (unseenTexts.value.length === 0) return null;
    return unseenTexts.value[Math.floor(Math.random() * unseenTexts.value.length)];
  }

  async function fetchFromApi(api: TextAPI): Promise<{ key: string; text: string }> {
    const response = await fetch(api.url);
    const data = await response.json();
    const fetchedText = api.parser(data);
    return { key: api.key, text: fetchedText };
  }

  function setTextWithTargets(newText: string, level: number): boolean {
    const result = generateTargets(newText, level, 3);
    if (result) {
      text.value = newText;
      targets.value = result.targets;
      currentFeatures.value = result.features;
      return true;
    }
    return false;
  }

  async function getText(level: number) {
    isLoading.value = true;

    // First try unseen text from cache
    const unseen = getUnseenFromCache();
    if (unseen && setTextWithTargets(unseen, level)) {
      isLoading.value = false;
      return;
    }

    // All texts seen (or cache empty), reset seen and fetch new
    if (allTextsSeen.value) {
      _seenTexts.value = [];
    }

    const apiPromises = TEXT_APIS.map(api =>
      fetchFromApi(api)
        .then(result => {
          addToCache(result.key, result.text);
          return result;
        })
        .catch(() => null)
    );

    try {
      const firstResult = await Promise.race(
        apiPromises.map(p => p.then(r => {
          if (r && r.text && r.text.length >= 50) return r;
          throw new Error('Invalid text');
        }))
      );

      if (firstResult && setTextWithTargets(firstResult.text, level)) {
        isLoading.value = false;
        Promise.allSettled(apiPromises);
        return;
      }
    } catch {
      // All APIs failed, try any unseen from cache
      const cached = getUnseenFromCache();
      if (cached && setTextWithTargets(cached, level)) {
        isLoading.value = false;
        return;
      }
    }

    // Fallback
    if (!setTextWithTargets(FALLBACK_TEXT, level)) {
      text.value = FALLBACK_TEXT;
      targets.value = [
        { text: 'qui', feature: 'literal', featureName: 'Literal Characters' },
        { text: 'fox', feature: 'literal', featureName: 'Literal Characters' },
        { text: 'art', feature: 'literal', featureName: 'Literal Characters' }
      ];
      currentFeatures.value = [];
    }

    isLoading.value = false;
  }

  return {
    text,
    targets,
    currentFeatures,
    isLoading,
    textCache,
    markText,
    getText
  };
});
