<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isAllMatched = ref(false);

const handleStateChange = (e: CustomEvent<{ isAllMatched: boolean }>) => {
  isAllMatched.value = e.detail.isAllMatched;
};

const emitSkip = () => {
  window.dispatchEvent(new CustomEvent('game:skip'));
};

const emitNext = () => {
  window.dispatchEvent(new CustomEvent('game:next'));
};

const emitShowGuide = () => {
  window.dispatchEvent(new CustomEvent('game:show-guide'));
};

onMounted(() => {
  window.addEventListener('game:state', handleStateChange as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('game:state', handleStateChange as EventListener);
});
</script>

<template>
  <div class="flex items-center gap-2">
    <v-tooltip text="Preferences" location="bottom">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="tonal"
          color="grey"
          prepend-icon="mdi-cog"
          href="/settings"
        >
          Settings
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip :text="isAllMatched ? 'Continue to next level' : 'Get a new challenge'" location="bottom">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          :variant="isAllMatched ? 'elevated' : 'tonal'"
          :elevation="isAllMatched ? 16 : 0"
          color="secondary"
          :prepend-icon="isAllMatched ? 'mdi-check-circle' : 'mdi-refresh'"
          height="auto"
          min-width="200"
          class="py-2"
          @click="isAllMatched ? emitNext() : emitSkip()"
        >
          <span>
            <div class="text-sm">{{ isAllMatched ? 'Next' : 'Skip' }}</div>
            <small class="text-medium-emphasis text-xs">{{ isAllMatched ? 'Level up' : 'New challenge' }}</small>
          </span>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Regex help" location="bottom">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="tonal"
          color="grey"
          append-icon="mdi-book-open-variant"
          @click="emitShowGuide"
        >
          Pattern Guide
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>
