<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const theme = useLocalStorage('theme',
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
);

const isLight = computed(() => theme.value === 'light');

watchEffect(() => {
  if (typeof document === 'undefined') return;

  if (theme.value === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
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
    background: #374151;
    border-radius: 100px;
    position: relative;
    transition: background 0.3s;

    &.light {
      background: var(--space-yellow, #ffff85);
    }
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 20px;
    transition: 0.3s;

    .light & {
      left: calc(100% - 22px);
    }
  }

  &:active .toggle-thumb {
    width: 28px;
  }
}
</style>
