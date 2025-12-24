<script setup lang="ts">
import type { Target } from './regex-features';

interface Props {
  targets: Target[];
  matchedTargets: number[];
}

defineProps<Props>();
</script>

<template>
  <v-card class="target-display" variant="outlined">
    <v-card-text>
      <div class="header">
        <v-icon size="20" color="purple">mdi-target</v-icon>
        <span>Find these patterns</span>
      </div>

      <div class="targets-list">
        <v-chip
          v-for="(target, index) in targets"
          :key="index"
          :color="matchedTargets.includes(index) ? 'success' : 'default'"
          :variant="matchedTargets.includes(index) ? 'flat' : 'outlined'"
          class="target-chip"
        >
          <v-icon
            size="16"
            :icon="matchedTargets.includes(index) ? 'mdi-check-circle' : 'mdi-circle-outline'"
            class="mr-2"
          />
          <span :class="{ matched: matchedTargets.includes(index) }">
            "{{ target.text }}"
          </span>
          <span
            v-if="matchedTargets.includes(index)"
            class="matched-dot"
          ></span>
        </v-chip>
      </div>

      <div class="tip">
        Tip: Write a single regex that matches all {{ targets.length }} patterns
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.target-display {
  background: rgba(15, 23, 42, 0.6) !important;
  backdrop-filter: blur(12px);
  border-color: rgba(71, 85, 105, 0.5) !important;
  border-radius: 12px !important;

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: rgb(203, 213, 225);
    font-weight: 500;
  }

  .targets-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .target-chip {
    font-family: monospace;
    font-size: 0.875rem;
    position: relative;

    .matched {
      text-decoration: line-through;
      opacity: 0.6;
    }

    .matched-dot {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 12px;
      height: 12px;
      background: rgb(16, 185, 129);
      border-radius: 50%;
    }
  }

  .tip {
    margin-top: 16px;
    font-size: 0.75rem;
    color: rgb(100, 116, 139);
  }
}
</style>
