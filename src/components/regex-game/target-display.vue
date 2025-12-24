<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWindowFocus } from '@vueuse/core';
import type { Target } from './regex-features';

interface Props {
  targets: Target[];
  matchedTargets: number[];
  modelValue: string;
  isValid: boolean;
  matchCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [];
}>();

const inputRef = ref();
const error = ref<string | null>(null);
const windowFocused = useWindowFocus();

watch(windowFocused, (focused) => {
  if (focused) {
    inputRef.value?.focus();
  }
});

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      error.value = null;
      return;
    }
    try {
      new RegExp(value);
      error.value = null;
    } catch {
      error.value = 'Invalid regex syntax';
    }
  }
);

const handleKeyDown = () => {
  if (!error.value && props.modelValue) {
    emit('submit');
  }
};
</script>

<template>
  <v-card-outlined>
    <v-card-text>
      <div class="flex items-center gap-2 mb-4 text-slate-300 font-medium">
        <v-icon size="20" color="secondary">mdi-target</v-icon>
        <span>Find these patterns</span>
      </div>

      <div class="flex flex-wrap gap-3">
        <v-chip v-for="(target, index) in targets" :key="index"
          :color="matchedTargets.includes(index) ? 'success' : 'primary'"
          :variant="matchedTargets.includes(index) ? 'flat' : 'outlined'" class="font-mono text-sm relative">
          <v-icon size="16" :icon="matchedTargets.includes(index) ? 'mdi-check-circle' : 'mdi-circle-outline'"
            class="mr-2" />
          <span :class="{ 'line-through opacity-60': matchedTargets.includes(index) }">
            "{{ target.text }}"
          </span>
          <span v-if="matchedTargets.includes(index)"
            class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <v-text-field rounded="xl" ref="inputRef" :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)" @keydown.enter="handleKeyDown"
        placeholder="enter your regex..." variant="solo-filled" density="comfortable" color="primary"
        base-color="primary" hide-details="auto" prepend-inner-icon="mdi-console" prefix="/" suffix="/g"
        :error-messages="error || undefined"
        :messages="isValid ? 'All targets matched! Press Enter to continue' : undefined" autofocus single-line flat
        class="regex-input">
        <template #append-inner>
          <v-chip v-if="modelValue && !error" :color="matchCount > 0 ? 'success' : 'default'" size="small"
            variant="tonal">
            {{ matchCount }} match{{ matchCount !== 1 ? 'es' : '' }}
          </v-chip>
        </template>
      </v-text-field>
    </v-card-actions>
  </v-card-outlined>
</template>

<style lang="scss">
.regex-input {
  .v-field {
    font-family: monospace;
    background: rgba(15, 23, 42, 0.8) !important;
  }

  .v-field__input {
    color: rgb(34, 211, 238) !important;
    font-family: monospace;
  }

  .v-field__prepend-inner,
  .v-field__append-inner {
    padding-top: 0;
  }
}
</style>
