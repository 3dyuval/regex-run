<script setup lang="ts">
import { computed } from 'vue';
import type { Target } from './regex-features';

interface Props {
  text: string;
  regex: string;
  targets: Target[];
}

const props = defineProps<Props>();

interface Segment {
  text: string;
  highlighted: boolean;
}

const highlightedText = computed<Segment[]>(() => {
  if (!props.text) return [];

  let matches: { start: number; end: number; type: string }[] = [];

  if (props.regex) {
    try {
      const re = new RegExp(props.regex, 'g');
      let match;
      while ((match = re.exec(props.text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          type: 'regex'
        });
        if (match[0].length === 0) break;
      }
    } catch {
      // Invalid regex, ignore
    }
  }

  const segments: Segment[] = [];
  let lastIndex = 0;

  matches.sort((a, b) => a.start - b.start);

  const mergedMatches: { start: number; end: number }[] = [];
  for (const match of matches) {
    if (mergedMatches.length === 0) {
      mergedMatches.push({ ...match });
    } else {
      const last = mergedMatches[mergedMatches.length - 1];
      if (match.start <= last.end) {
        last.end = Math.max(last.end, match.end);
      } else {
        mergedMatches.push({ ...match });
      }
    }
  }

  for (const match of mergedMatches) {
    if (match.start > lastIndex) {
      segments.push({
        text: props.text.substring(lastIndex, match.start),
        highlighted: false
      });
    }
    segments.push({
      text: props.text.substring(match.start, match.end),
      highlighted: true
    });
    lastIndex = match.end;
  }

  if (lastIndex < props.text.length) {
    segments.push({
      text: props.text.substring(lastIndex),
      highlighted: false
    });
  }

  return segments.length > 0 ? segments : [{ text: props.text, highlighted: false }];
});
</script>

<template>
  <v-card class="game-board" variant="outlined">
    <div class="window-controls">
      <div class="dot red"></div>
      <div class="dot yellow"></div>
      <div class="dot green"></div>
      <span class="file-name">text.txt</span>
    </div>

    <v-card-text class="text-content">
      <template v-for="(segment, index) in highlightedText" :key="index">
        <span v-if="segment.highlighted" class="highlight">{{ segment.text }}</span>
        <span v-else>{{ segment.text }}</span>
      </template>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.game-board {
  background: rgba(var(--v-theme-surface), 0.8) !important;
  backdrop-filter: blur(12px);
  border-color: rgba(var(--v-theme-on-surface), 0.2) !important;
  border-radius: 16px !important;

  .window-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.15);

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;

      &.red { background: rgba(var(--v-theme-error), 0.8); }
      &.yellow { background: rgba(var(--v-theme-warning), 0.8); }
      &.green { background: rgba(var(--v-theme-success), 0.8); }
    }

    .file-name {
      margin-left: 16px;
      color: rgba(var(--v-theme-on-surface), 0.6);
      font-size: 0.875rem;
      font-family: monospace;
    }
  }

  .text-content {
    font-family: monospace;
    font-size: 1rem;
    line-height: 1.75;
    color: rgb(var(--v-theme-on-surface));
    max-height: 300px;
    overflow-y: auto;

    .highlight {
      color: rgb(var(--v-theme-primary));
      background: rgba(var(--v-theme-primary), 0.3);
      border-radius: 4px;
      padding: 0 2px;
      border-bottom: 2px solid rgb(var(--v-theme-primary));
    }
  }
}
</style>
