<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import GameBoard from '@/components/regex-game/game-board.vue';
import TargetDisplay from '@/components/regex-game/target-display.vue';
import LevelIndicator from '@/components/regex-game/level-indicator.vue';
import SuccessModal from '@/components/regex-game/success-modal.vue';
import RegexLegend from '@/components/regex-game/regex-legend.vue';
import { useTextStore } from '@/store/text.store';

const textStore = useTextStore();
const { text, targets, currentFeatures, isLoading } = storeToRefs(textStore);

const level = ref(1);
const score = ref(0);
const streak = ref(0);
const regex = ref('');
const showSuccess = ref(false);
const pointsEarned = ref(0);
const showLegend = ref(false);

const getText = async () => {
  regex.value = '';
  await textStore.getText(level.value);
};

const matchedTargets = computed(() => {
  if (!regex.value || !text.value) return [];

  try {
    const re = new RegExp(regex.value, 'g');
    const matches: { start: number; end: number; text: string }[] = [];
    let match;
    while ((match = re.exec(text.value)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
      if (match[0].length === 0) break;
    }

    return targets.value
      .map((target, index) => {
        const isMatched = matches.some(
          (m) =>
            m.text.includes(target.text) ||
            (target.start !== undefined &&
              target.end !== undefined &&
              m.start <= target.start &&
              m.end >= target.end)
        );
        return isMatched ? index : -1;
      })
      .filter((i) => i !== -1);
  } catch {
    return [];
  }
});

const matchCount = computed(() => {
  if (!regex.value || !text.value) return 0;
  try {
    const re = new RegExp(regex.value, 'g');
    const matches = text.value.match(re);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
});

const isAllMatched = computed(
  () => matchedTargets.value.length === targets.value.length && targets.value.length > 0
);

const handleSubmit = () => {
  if (isAllMatched.value) {
    const basePoints = 100 * level.value;
    const streakBonus = streak.value * 25;
    const earned = basePoints + streakBonus;

    pointsEarned.value = earned;
    score.value += earned;
    streak.value++;
    textStore.markText();
    showSuccess.value = true;
  }
};

const handleNextLevel = () => {
  showSuccess.value = false;
  level.value++;
  getText();
};

const handleSkip = () => {
  streak.value = 0;
  getText();
};

onMounted(() => {
  getText();
});
</script>

<template>
  <div class="game-page">
    <div class="game-container">
      <!-- Header -->
      <div class="game-header">
        <div class="header-badge">
          <v-icon size="20" color="cyan">mdi-code-tags</v-icon>
          <span>Regex Challenge</span>
        </div>
        <h1 class="game-title">Pattern Finder</h1>
        <p class="game-subtitle">Master regular expressions one pattern at a time</p>
      </div>

      <!-- Level indicator -->
      <LevelIndicator :level="level" :score="score" :streak="streak" />

      <!-- Main game area -->
      <div v-if="isLoading" class="loading-state">
        <v-progress-circular indeterminate color="cyan" size="40" />
        <p>Loading challenge...</p>
      </div>

      <div v-else class="game-content">
        <GameBoard :text="text" :regex="regex" :targets="targets" />

        <TargetDisplay
          v-model="regex"
          :targets="targets"
          :matched-targets="matchedTargets"
          :is-valid="isAllMatched"
          :match-count="matchCount"
          @submit="handleSubmit"
        />

        <!-- Action buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <v-btn
            variant="tonal"
            color="grey"
            prepend-icon="mdi-cog"
            spaced="start"
            height="56"
            min-width="180"
            href="/settings"
          >
            <span class="text-right">
              <div>Settings</div>
              <small class="text-medium-emphasis">Preferences</small>
            </span>
          </v-btn>

          <v-btn
            variant="tonal"
            color="grey"
            prepend-icon="mdi-refresh"
            append-icon="mdi-chevron-right"
            spaced="both"
            height="56"
            min-width="180"
            @click="handleSkip"
          >
            <span>
              <div>Skip</div>
              <small class="text-medium-emphasis">New challenge</small>
            </span>
          </v-btn>

          <v-btn
            variant="tonal"
            color="secondary"
            append-icon="mdi-book-open-variant"
            spaced="end"
            height="56"
            min-width="180"
            @click="showLegend = true"
          >
            <span class="text-left">
              <div>Pattern Guide</div>
              <small class="text-medium-emphasis">Regex help</small>
            </span>
          </v-btn>
        </div>

        <!-- Feature hints -->
        <v-card-info v-if="currentFeatures.length > 0">
          <v-card-text>
            <div class="flex items-center gap-3 mb-3 font-medium">
              <v-icon size="20" color="secondary">mdi-lightbulb-on</v-icon>
              <span class="text-purple-200">Features for this level</span>
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              <v-chip v-for="(feature, idx) in currentFeatures" :key="idx">
                <v-icon size="14" class="mr-1">{{ feature.icon }}</v-icon>
                {{ feature.name }}
              </v-chip>
            </div>
            <p class="text-xs text-purple-200/70 m-0">Try using these patterns to match all targets</p>
          </v-card-text>
        </v-card-info>
      </div>
    </div>

    <SuccessModal v-model="showSuccess" :level="level" :score="score" :points-earned="pointsEarned"
      @next-level="handleNextLevel" />

    <RegexLegend v-model="showLegend" :current-level="level" />
  </div>
</template>

<style lang="scss">
.game-page {
  position: relative;

  .game-container {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 16px;

    @media (min-width: 768px) {
      padding: 48px 16px;
    }
  }

  .game-header {
    text-align: center;
    margin-bottom: 32px;

    @media (min-width: 768px) {
      margin-bottom: 48px;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(71, 85, 105, 0.5);
      border-radius: 9999px;
      margin-bottom: 16px;

      span {
        color: rgb(203, 213, 225);
        font-weight: 500;
      }
    }

    .game-title {
      font-size: 2.25rem;
      font-weight: bold;
      background: linear-gradient(90deg, rgb(34, 211, 238), rgb(168, 85, 247), rgb(236, 72, 153));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;

      @media (min-width: 768px) {
        font-size: 3rem;
      }
    }

    .game-subtitle {
      color: rgb(148, 163, 184);
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;

    p {
      margin-top: 16px;
      color: rgb(148, 163, 184);
    }
  }

  .game-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}
</style>
