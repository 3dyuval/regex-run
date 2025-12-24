<script setup lang="ts">
const emitSkip = () => {
  window.dispatchEvent(new CustomEvent('game:skip'));
};

const emitShowGuide = () => {
  window.dispatchEvent(new CustomEvent('game:show-guide'));
};
</script>

<template>
  <div class="flex items-center gap-2">
    <v-btn
      variant="tonal"
      color="grey"
      prepend-icon="mdi-cog"
      spaced="start"
      height="48"
      min-width="140"
      href="/settings"
    >
      <span class="text-right">
        <div class="text-sm">Settings</div>
        <small class="text-medium-emphasis text-xs">Preferences</small>
      </span>
    </v-btn>

    <v-btn
      variant="tonal"
      color="grey"
      prepend-icon="mdi-refresh"
      append-icon="mdi-chevron-right"
      spaced="both"
      height="48"
      min-width="140"
      @click="emitSkip"
    >
      <span>
        <div class="text-sm">Skip</div>
        <small class="text-medium-emphasis text-xs">New challenge</small>
      </span>
    </v-btn>

    <v-btn
      variant="tonal"
      color="secondary"
      append-icon="mdi-book-open-variant"
      spaced="end"
      height="48"
      min-width="140"
      @click="emitShowGuide"
    >
      <span class="text-left">
        <div class="text-sm">Pattern Guide</div>
        <small class="text-medium-emphasis text-xs">Regex help</small>
      </span>
    </v-btn>
  </div>
</template>
