<script setup lang="ts">
import { computed } from 'vue';
import { REGEX_FEATURES, getAvailableFeatures } from './regex-features';

interface Props {
  modelValue: boolean;
  currentLevel: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const availableFeatures = computed(() => getAvailableFeatures(props.currentLevel));
const availableIds = computed(() => new Set(availableFeatures.value.map((f) => f.id)));

const isUnlocked = (featureId: string) => availableIds.value.has(featureId);

const getUnlockLevel = (difficultyScore: number) => {
  return Math.ceil((difficultyScore - 2) / 0.8);
};

const close = () => emit('update:modelValue', false);
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="900"
    scrollable
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="legend-card">
      <v-card-title class="legend-header">
        <div class="header-content">
          <div class="icon-box">
            <v-icon color="white">mdi-book-open-variant</v-icon>
          </div>
          <div class="header-text">
            <h2>Regex Pattern Guide</h2>
            <p>Level {{ currentLevel }} - {{ availableFeatures.length }} features unlocked</p>
          </div>
        </div>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="legend-content">
        <div class="features-grid">
          <v-card
            v-for="feature in REGEX_FEATURES"
            :key="feature.id"
            :class="['feature-card', { locked: !isUnlocked(feature.id) }]"
            variant="outlined"
          >
            <div v-if="!isUnlocked(feature.id)" class="locked-overlay">
              <v-icon size="24" color="grey">mdi-lock</v-icon>
              <span>Unlocks at Level {{ getUnlockLevel(feature.difficulty_score) }}</span>
            </div>

            <div class="feature-header">
              <div class="feature-icon">
                <v-icon>{{ feature.icon }}</v-icon>
              </div>
              <div class="feature-info">
                <h4>{{ feature.name }}</h4>
                <div class="feature-meta">
                  <span>Difficulty: {{ feature.difficulty_score }}</span>
                  <v-icon v-if="isUnlocked(feature.id)" size="12" color="success">
                    mdi-check-circle
                  </v-icon>
                </div>
              </div>
            </div>

            <p class="feature-description">{{ feature.description }}</p>

            <div class="feature-example">
              <span class="example-label">Example</span>
              <code>/{{ feature.example }}/g</code>
              <p>{{ feature.explanation }}</p>
            </div>
          </v-card>
        </div>

        <v-alert
          type="info"
          variant="tonal"
          class="mt-6"
        >
          <strong>Tip:</strong> As you progress through levels, more advanced regex features
          will unlock automatically. Practice with simpler patterns first!
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.legend-card {
  background: rgb(15, 23, 42) !important;
  border: 1px solid rgba(71, 85, 105, 0.5);

  .legend-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(71, 85, 105, 0.5);
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(12px);

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .icon-box {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgb(34, 211, 238), rgb(168, 85, 247));
        border-radius: 12px;
      }

      .header-text {
        h2 {
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
          margin: 0;
        }

        p {
          font-size: 0.875rem;
          color: rgb(148, 163, 184);
          margin: 0;
        }
      }
    }
  }

  .legend-content {
    padding: 24px;
    max-height: calc(85vh - 100px);
    overflow-y: auto;

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 16px;
    }

    .feature-card {
      position: relative;
      padding: 16px;
      background: rgba(30, 41, 59, 0.5) !important;
      border-color: rgba(71, 85, 105, 0.5) !important;
      border-radius: 12px !important;
      overflow: hidden;

      &.locked {
        opacity: 0.6;

        .locked-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(1px);
          z-index: 10;

          span {
            font-size: 0.75rem;
            color: rgb(100, 116, 139);
            font-weight: 500;
          }
        }
      }

      .feature-header {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 12px;

        .feature-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 211, 238, 0.2);
          border: 1px solid rgba(34, 211, 238, 0.5);
          border-radius: 8px;
          color: rgb(34, 211, 238);
        }

        .feature-info {
          h4 {
            color: white;
            font-weight: 600;
            margin: 0;
          }

          .feature-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;

            span {
              font-size: 0.75rem;
              color: rgb(100, 116, 139);
            }
          }
        }
      }

      .feature-description {
        font-size: 0.875rem;
        color: rgb(203, 213, 225);
        margin-bottom: 12px;
      }

      .feature-example {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 8px;
        padding: 12px;

        .example-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgb(100, 116, 139);
          display: block;
          margin-bottom: 4px;
        }

        code {
          display: block;
          font-family: monospace;
          font-size: 0.875rem;
          color: rgb(34, 211, 238);
          margin-bottom: 4px;
        }

        p {
          font-size: 0.75rem;
          color: rgb(148, 163, 184);
          margin: 0;
        }
      }
    }
  }
}
</style>
