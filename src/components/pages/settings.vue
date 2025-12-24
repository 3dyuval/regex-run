<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { REGEX_FEATURES } from '@/components/regex-game/regex-features';

interface Preset {
  name: string;
  maxDifficulty: number;
}

const PRESETS: Record<string, Preset> = {
  beginner: { name: 'Beginner', maxDifficulty: 3 },
  intermediate: { name: 'Intermediate', maxDifficulty: 6 },
  advanced: { name: 'Advanced', maxDifficulty: 9 },
  all: { name: 'All Features', maxDifficulty: 10 }
};

const selectedFeatures = ref<string[]>(() => {
  const saved = localStorage.getItem('regexGameFeatures');
  if (saved) {
    return JSON.parse(saved);
  }
  return REGEX_FEATURES.filter((f) => f.difficulty_score <= 5).map((f) => f.id);
});

const preset = ref('intermediate');

watch(
  selectedFeatures,
  (features) => {
    localStorage.setItem('regexGameFeatures', JSON.stringify(features));
  },
  { deep: true }
);

const presetOptions = computed(() => [
  { title: 'Beginner (Basic patterns)', value: 'beginner' },
  { title: 'Intermediate (Includes quantifiers)', value: 'intermediate' },
  { title: 'Advanced (Most features)', value: 'advanced' },
  { title: 'All Features (Expert mode)', value: 'all' },
  ...(preset.value === 'custom' ? [{ title: 'Custom Selection', value: 'custom' }] : [])
]);

const handlePresetChange = (value: string) => {
  preset.value = value;
  if (value === 'custom') return;

  const maxDiff = PRESETS[value].maxDifficulty;
  selectedFeatures.value = REGEX_FEATURES.filter((f) => f.difficulty_score <= maxDiff).map(
    (f) => f.id
  );
};

const toggleFeature = (featureId: string) => {
  const index = selectedFeatures.value.indexOf(featureId);
  if (index > -1) {
    selectedFeatures.value.splice(index, 1);
  } else {
    selectedFeatures.value.push(featureId);
  }
  preset.value = 'custom';
};

const toggleAll = () => {
  if (selectedFeatures.value.length === REGEX_FEATURES.length) {
    selectedFeatures.value = [];
  } else {
    selectedFeatures.value = REGEX_FEATURES.map((f) => f.id);
  }
  preset.value = 'custom';
};

const isSelected = (featureId: string) => selectedFeatures.value.includes(featureId);
</script>

<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- Header -->
      <div class="settings-header">
        <div class="header-left">
          <a href="/" class="back-link">
            <v-icon color="grey">mdi-chevron-left</v-icon>
          </a>
          <div class="header-content">
            <div class="icon-box">
              <v-icon color="white">mdi-cog</v-icon>
            </div>
            <div class="header-text">
              <h1>Game Settings</h1>
              <p>Customize your regex learning experience</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Preset Selector -->
      <v-card class="settings-card" variant="outlined">
        <v-card-text>
          <div class="card-header">
            <div>
              <h3>Feature Preset</h3>
              <p>Quick select features by difficulty level</p>
            </div>
            <v-btn variant="outlined" size="small" color="grey" @click="toggleAll">
              {{ selectedFeatures.length === REGEX_FEATURES.length ? 'Deselect All' : 'Select All' }}
            </v-btn>
          </div>

          <v-select
            :model-value="preset"
            :items="presetOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            bg-color="surface"
            @update:model-value="handlePresetChange"
          />
        </v-card-text>
      </v-card>

      <!-- Feature List -->
      <v-card class="settings-card features-card" variant="outlined">
        <v-card-text>
          <div class="card-header">
            <h3>Available Features</h3>
            <span class="feature-count">
              {{ selectedFeatures.length }} / {{ REGEX_FEATURES.length }} selected
            </span>
          </div>

          <div class="features-list">
            <v-card
              v-for="feature in REGEX_FEATURES"
              :key="feature.id"
              :class="['feature-item', { selected: isSelected(feature.id) }]"
              variant="outlined"
              @click="toggleFeature(feature.id)"
            >
              <div class="feature-checkbox">
                <v-checkbox
                  :model-value="isSelected(feature.id)"
                  hide-details
                  density="compact"
                  @click.stop="toggleFeature(feature.id)"
                />
              </div>

              <div class="feature-content">
                <div class="feature-header">
                  <v-icon size="16">{{ feature.icon }}</v-icon>
                  <h4>{{ feature.name }}</h4>
                  <v-chip size="x-small" variant="tonal">
                    Level {{ feature.difficulty_score }}
                  </v-chip>
                </div>
                <p class="feature-description">{{ feature.description }}</p>
                <div class="feature-example">
                  <code>{{ feature.example }}</code>
                  <span class="arrow">→</span>
                  <span>{{ feature.explanation }}</span>
                </div>
              </div>
            </v-card>
          </div>
        </v-card-text>
      </v-card>

      <!-- Save Info -->
      <div class="save-info">
        <v-icon size="16" color="success">mdi-check</v-icon>
        Your preferences are automatically saved
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 41, 59), rgb(15, 23, 42));
  padding: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }

  .settings-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .back-link {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .icon-box {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgb(168, 85, 247), rgb(34, 211, 238));
        border-radius: 12px;
      }

      .header-text {
        h1 {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          margin: 0;

          @media (min-width: 768px) {
            font-size: 1.875rem;
          }
        }

        p {
          font-size: 0.875rem;
          color: rgb(148, 163, 184);
          margin: 0;
        }
      }
    }
  }

  .settings-card {
    background: rgba(30, 41, 59, 0.6) !important;
    backdrop-filter: blur(12px);
    border-color: rgba(71, 85, 105, 0.5) !important;
    border-radius: 12px !important;
    margin-bottom: 24px;

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      h3 {
        color: white;
        font-weight: 600;
        margin: 0;
      }

      p {
        color: rgb(148, 163, 184);
        font-size: 0.875rem;
        margin: 0;
      }

      .feature-count {
        font-size: 0.875rem;
        color: rgb(148, 163, 184);
      }
    }
  }

  .features-card {
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: rgba(30, 41, 59, 0.3) !important;
      border-color: rgba(71, 85, 105, 0.5) !important;
      border-radius: 8px !important;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(30, 41, 59, 0.5) !important;
      }

      &.selected {
        background: rgba(34, 211, 238, 0.1) !important;
        border-color: rgba(34, 211, 238, 0.3) !important;
        border-left: 4px solid rgb(34, 211, 238) !important;
      }

      .feature-checkbox {
        margin-top: 4px;
      }

      .feature-content {
        flex: 1;
        min-width: 0;

        .feature-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;

          h4 {
            color: white;
            font-weight: 500;
            margin: 0;
          }
        }

        .feature-description {
          color: rgb(148, 163, 184);
          font-size: 0.875rem;
          margin: 0 0 8px;
        }

        .feature-example {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;

          code {
            padding: 4px 8px;
            background: rgba(15, 23, 42, 0.5);
            color: rgb(34, 211, 238);
            border-radius: 4px;
            font-family: monospace;
          }

          .arrow {
            color: rgb(100, 116, 139);
          }

          span:last-child {
            color: rgb(148, 163, 184);
          }
        }
      }
    }
  }

  .save-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    color: rgb(100, 116, 139);
    font-size: 0.875rem;
  }
}
</style>
