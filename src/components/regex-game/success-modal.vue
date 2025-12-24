<script setup lang="ts">
interface Props {
  modelValue: boolean;
  level: number;
  score: number;
  pointsEarned: number;
}

defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  nextLevel: [];
}>();

const handleNextLevel = () => {
  emit('update:modelValue', false);
  emit('nextLevel');
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="400"
    persistent
    class="success-modal"
  >
    <v-card class="modal-card">
      <div class="glow-effect"></div>

      <div class="icon-container">
        <div class="icon-bg"></div>
        <div class="icon-main">
          <v-icon size="40" color="white">mdi-sparkles</v-icon>
        </div>
      </div>

      <v-card-title class="modal-title">
        Level Complete!
      </v-card-title>

      <v-card-text class="modal-text">
        You've mastered level {{ level }}
      </v-card-text>

      <div class="stats-row">
        <v-card class="stat-card points" variant="outlined">
          <span class="stat-value">+{{ pointsEarned }}</span>
          <span class="stat-label">points</span>
        </v-card>

        <v-card class="stat-card total" variant="outlined">
          <div class="stat-value-row">
            <v-icon size="20" color="warning">mdi-trophy</v-icon>
            <span class="stat-value">{{ score }}</span>
          </div>
          <span class="stat-label">total score</span>
        </v-card>
      </div>

      <v-card-actions class="modal-actions">
        <v-btn
          block
          size="large"
          class="next-btn"
          @click="handleNextLevel"
        >
          Next Level
          <v-icon class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.success-modal {
  .modal-card {
    position: relative;
    background: linear-gradient(135deg, rgb(var(--v-theme-background)), rgb(var(--v-theme-surface))) !important;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    border-radius: 24px !important;
    padding: 32px;
    text-align: center;
    overflow: hidden;

    .glow-effect {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 256px;
      height: 256px;
      background: linear-gradient(to bottom, rgba(var(--v-theme-primary), 0.2), transparent);
      border-radius: 50%;
      filter: blur(48px);
    }

    .icon-container {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;

      .icon-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
        border-radius: 16px;
        transform: rotate(6deg);
        opacity: 0.5;
      }

      .icon-main {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
        border-radius: 16px;
      }
    }

    .modal-title {
      position: relative;
      font-size: 1.875rem !important;
      font-weight: bold;
      color: rgb(var(--v-theme-on-surface));
      text-align: center;
      justify-content: center;
    }

    .modal-text {
      position: relative;
      color: rgba(var(--v-theme-on-surface), 0.7);
      text-align: center;
      padding-bottom: 24px;
    }

    .stats-row {
      position: relative;
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;

      .stat-card {
        padding: 12px 16px;
        border-radius: 12px !important;
        text-align: center;

        &.points {
          background: rgba(var(--v-theme-success), 0.2) !important;
          border-color: rgba(var(--v-theme-success), 0.3) !important;

          .stat-value { color: rgb(var(--v-theme-success)); }
          .stat-label { color: rgba(var(--v-theme-success), 0.6); }
        }

        &.total {
          background: rgba(var(--v-theme-warning), 0.2) !important;
          border-color: rgba(var(--v-theme-warning), 0.3) !important;

          .stat-value { color: rgb(var(--v-theme-warning)); }
          .stat-label { color: rgba(var(--v-theme-warning), 0.6); }
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .stat-value-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.75rem;
          display: block;
        }
      }
    }

    .modal-actions {
      padding: 0;

      .next-btn {
        background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))) !important;
        color: rgb(var(--v-theme-background)) !important;
        font-weight: 600;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(var(--v-theme-secondary), 0.25);
      }
    }
  }
}
</style>
