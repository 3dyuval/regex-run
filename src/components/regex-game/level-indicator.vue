<script setup lang="ts">
interface Props {
  level: number;
  score: number;
}

defineProps<Props>();
</script>

<template>
  <div class="level-indicator">
    <div class="level-pill">
      <div class="level-badge">
        <div class="glow"></div>
        <div class="badge">{{ level }}</div>
      </div>
      <span class="level-text">Challenge {{ level }}</span>
      <span class="divider">|</span>
      <v-icon size="18" color="warning">mdi-trophy</v-icon>
      <span class="score-value">{{ score.toLocaleString() }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.level-indicator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .level-pill {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 8px 20px 8px 8px;
    background: rgba(var(--v-theme-surface), 0.5);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    border-radius: 9999px;

    .level-badge {
      position: relative;

      .glow {
        position: absolute;
        inset: -4px;
        background: rgba(var(--v-theme-secondary), 0.4);
        filter: blur(12px);
        border-radius: 50%;
      }

      .badge {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgb(var(--v-theme-secondary)), rgb(var(--v-theme-primary)));
        border-radius: 50%;
        color: rgb(var(--v-theme-background));
        font-weight: bold;
        font-size: 1.125rem;
        box-shadow: 0 4px 12px rgba(var(--v-theme-secondary), 0.25);
      }
    }

    .level-text {
      color: rgb(var(--v-theme-on-surface));
      font-weight: 500;
    }

    .divider {
      color: rgba(var(--v-theme-on-surface), 0.5);
    }

    .score-value {
      color: rgb(var(--v-theme-warning));
      font-weight: 600;
    }
  }
}
</style>
