<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import GameBoard from '@/components/regex-game/game-board.vue';
import RegexInput from '@/components/regex-game/regex-input.vue';
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
    <!-- Background decorations -->
    <div class="background-decorations">
      <div class="blob purple"></div>
      <div class="blob cyan"></div>
      <div class="grid-pattern"></div>
    </div>

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
      <div class="level-row">
        <LevelIndicator :level="level" :score="score" :streak="streak" />
        <a href="/settings" class="settings-link">
          <v-icon color="grey">mdi-cog</v-icon>
        </a>
      </div>

      <!-- Main game area -->
      <div v-if="isLoading" class="loading-state">
        <v-progress-circular indeterminate color="cyan" size="40" />
        <p>Loading challenge...</p>
      </div>

      <div v-else class="game-content">
        <GameBoard :text="text" :regex="regex" :targets="targets" />

        <TargetDisplay :targets="targets" :matched-targets="matchedTargets" />

        <RegexInput
          v-model="regex"
          :is-valid="isAllMatched"
          :match-count="matchCount"
          @submit="handleSubmit"
        />

        <!-- Action buttons -->
        <div class="action-buttons">
          <div class="left-actions">
            <v-btn variant="outlined" color="grey" @click="handleSkip">
              <v-icon class="mr-2">mdi-refresh</v-icon>
              Skip
            </v-btn>
            <v-btn variant="outlined" color="grey" @click="showLegend = true">
              <v-icon class="mr-2">mdi-book-open-variant</v-icon>
              Pattern Guide
            </v-btn>
          </div>

          <v-btn
            :disabled="!isAllMatched"
            class="submit-btn"
            size="large"
            @click="handleSubmit"
          >
            Submit
          </v-btn>
        </div>

        <!-- Feature hints -->
        <v-card
          v-if="currentFeatures.length > 0"
          class="feature-hints"
          variant="outlined"
        >
          <v-card-text>
            <div class="hints-header">
              <v-icon size="20" color="purple">mdi-lightbulb-on</v-icon>
              <span>Features for this level</span>
            </div>
            <div class="hints-chips">
              <v-chip
                v-for="(feature, idx) in currentFeatures"
                :key="idx"
                size="small"
                variant="tonal"
                color="purple"
              >
                <v-icon size="14" class="mr-1">{{ feature.icon }}</v-icon>
                {{ feature.name }}
              </v-chip>
            </div>
            <p class="hints-tip">Try using these patterns to match all targets</p>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <SuccessModal
      v-model="showSuccess"
      :level="level"
      :score="score"
      :points-earned="pointsEarned"
      @next-level="handleNextLevel"
    />

    <RegexLegend v-model="showLegend" :current-level="level" />
  </div>
</template>

<style lang="scss">
.game-page {
  min-height: 100vh;
  background: rgb(15, 23, 42);
  color: white;
  position: relative;
  overflow: hidden;

  .background-decorations {
    position: fixed;
    inset: 0;
    pointer-events: none;

    .blob {
      position: absolute;
      width: 384px;
      height: 384px;
      border-radius: 50%;
      filter: blur(48px);

      &.purple {
        top: 0;
        left: 25%;
        background: rgba(168, 85, 247, 0.1);
      }

      &.cyan {
        bottom: 0;
        right: 25%;
        background: rgba(34, 211, 238, 0.1);
      }
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.5;
    }
  }

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

  .level-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;

    .settings-link {
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

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    .left-actions {
      display: flex;
      gap: 12px;
    }

    .submit-btn {
      background: linear-gradient(90deg, rgb(34, 211, 238), rgb(168, 85, 247)) !important;
      color: white !important;
      font-weight: 600;
      padding: 0 32px;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);

      &:disabled {
        opacity: 0.5;
      }
    }
  }

  .feature-hints {
    background: rgba(168, 85, 247, 0.1) !important;
    border-color: rgba(168, 85, 247, 0.3) !important;
    border-radius: 12px !important;

    .hints-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      span {
        color: rgb(216, 180, 254);
        font-weight: 500;
      }
    }

    .hints-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    .hints-tip {
      font-size: 0.75rem;
      color: rgba(216, 180, 254, 0.7);
      margin: 0;
    }
  }
}
</style>
