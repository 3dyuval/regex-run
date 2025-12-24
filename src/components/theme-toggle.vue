<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useTheme } from 'vuetify';

const vuetifyTheme = useTheme();
const theme = useLocalStorage('theme',
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
);

const isLight = computed(() => theme.value === 'light');

watchEffect(() => {
  if (typeof document === 'undefined') return;

  // Update document classes for Tailwind/CSS
  if (theme.value === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }

  // Update Vuetify theme
  vuetifyTheme.global.name.value = theme.value;
});

function toggle() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <div class="theme-toggle" @click="toggle">
    <div class="toggle-track" :class="{ light: isLight }">
      <div class="toggle-thumb" />
    </div>
  </div>
</template>

<style lang="scss">
.theme-toggle {
  cursor: pointer;

  .toggle-track {
    width: 44px;
    height: 24px;
    background: rgb(var(--v-theme-surface));
    border-radius: 100px;
    position: relative;
    transition: background 0.3s;

    &.light {
      background: rgb(var(--v-theme-warning));
    }
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: rgb(var(--v-theme-on-surface));
    border-radius: 20px;
    transition: 0.3s;

    .light & {
      left: calc(100% - 22px);
      background: rgb(var(--v-theme-background));
    }
  }

  &:active .toggle-thumb {
    width: 28px;
  }
}
</style>
