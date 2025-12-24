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
    background: linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 41, 59)) !important;
    border: 1px solid rgba(71, 85, 105, 0.5);
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
      background: linear-gradient(to bottom, rgba(34, 211, 238, 0.2), transparent);
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
        background: linear-gradient(135deg, rgb(34, 211, 238), rgb(168, 85, 247));
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
        background: linear-gradient(135deg, rgb(34, 211, 238), rgb(168, 85, 247));
        border-radius: 16px;
      }
    }

    .modal-title {
      position: relative;
      font-size: 1.875rem !important;
      font-weight: bold;
      color: white;
      text-align: center;
      justify-content: center;
    }

    .modal-text {
      position: relative;
      color: rgb(148, 163, 184);
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
          background: rgba(16, 185, 129, 0.2) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;

          .stat-value { color: rgb(52, 211, 153); }
          .stat-label { color: rgba(52, 211, 153, 0.6); }
        }

        &.total {
          background: rgba(234, 179, 8, 0.2) !important;
          border-color: rgba(234, 179, 8, 0.3) !important;

          .stat-value { color: rgb(250, 204, 21); }
          .stat-label { color: rgba(250, 204, 21, 0.6); }
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
        background: linear-gradient(90deg, rgb(34, 211, 238), rgb(168, 85, 247)) !important;
        color: white !important;
        font-weight: 600;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
      }
    }
  }
}
</style>
