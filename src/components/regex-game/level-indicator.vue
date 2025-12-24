<script setup lang="ts">
interface Props {
  level: number;
  score: number;
  streak: number;
}

defineProps<Props>();
</script>

<template>
  <div class="level-indicator">
    <div class="level-info">
      <div class="level-badge">
        <div class="glow"></div>
        <div class="badge">{{ level }}</div>
      </div>
      <div class="level-text">
        <span class="label">Level</span>
        <span class="value">Challenge {{ level }}</span>
      </div>
    </div>

    <div class="stats">
      <v-chip
        v-if="streak > 1"
        color="warning"
        variant="tonal"
        size="small"
        class="streak-chip"
      >
        <v-icon size="16" class="mr-1">mdi-lightning-bolt</v-icon>
        {{ streak }}x streak
      </v-chip>

      <div class="score-display">
        <v-icon size="20" color="warning">mdi-trophy</v-icon>
        <div class="score-text">
          <span class="label">Score</span>
          <span class="value">{{ score.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.level-indicator {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .level-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .level-badge {
      position: relative;

      .glow {
        position: absolute;
        inset: 0;
        background: rgba(168, 85, 247, 0.3);
        filter: blur(16px);
        border-radius: 50%;
      }

      .badge {
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238));
        border-radius: 12px;
        color: white;
        font-weight: bold;
        font-size: 1.125rem;
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
      }
    }

    .level-text {
      display: flex;
      flex-direction: column;

      .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgb(100, 116, 139);
      }

      .value {
        color: white;
        font-weight: 600;
      }
    }
  }

  .stats {
    display: flex;
    align-items: center;
    gap: 24px;

    .streak-chip {
      animation: pulse 2s infinite;
    }

    .score-display {
      display: flex;
      align-items: center;
      gap: 8px;

      .score-text {
        display: flex;
        flex-direction: column;

        .label {
          font-size: 0.75rem;
          color: rgb(100, 116, 139);
        }

        .value {
          color: white;
          font-weight: bold;
          font-size: 1.125rem;
        }
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
