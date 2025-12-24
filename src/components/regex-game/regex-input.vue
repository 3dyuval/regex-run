<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string;
  isValid: boolean;
  matchCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [];
}>();

const error = ref<string | null>(null);

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

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !error.value && props.modelValue) {
    emit('submit');
  }
};

const updateValue = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="regex-input-wrapper">
    <div class="input-container">
      <div class="prefix">
        <v-icon size="20" color="purple">mdi-console</v-icon>
        <span class="slash">/</span>
      </div>

      <input
        type="text"
        :value="modelValue"
        @input="updateValue"
        @keydown="handleKeyDown"
        placeholder="enter your regex..."
        class="regex-input"
      />

      <div class="suffix">
        <span class="flags">/g</span>
        <v-chip
          v-if="modelValue && !error"
          :color="matchCount > 0 ? 'success' : 'default'"
          size="small"
          variant="tonal"
        >
          {{ matchCount }} match{{ matchCount !== 1 ? 'es' : '' }}
        </v-chip>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <v-icon size="16" color="error">mdi-alert-circle</v-icon>
      {{ error }}
    </div>

    <div v-if="isValid" class="success-message">
      <v-icon size="16" color="success">mdi-check-circle</v-icon>
      All targets matched! Press Enter to continue
    </div>
  </div>
</template>

<style lang="scss">
.regex-input-wrapper {
  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(var(--v-theme-surface), 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    border-radius: 12px;
    padding: 0 16px;

    &:focus-within {
      border-color: rgba(var(--v-theme-primary), 0.5);
      box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
    }

    .prefix {
      display: flex;
      align-items: center;
      gap: 8px;

      .slash {
        color: rgba(var(--v-theme-on-surface), 0.6);
        font-family: monospace;
      }
    }

    .regex-input {
      flex: 1;
      background: transparent;
      border: none;
      padding: 16px 8px;
      font-family: monospace;
      font-size: 1.125rem;
      color: rgb(var(--v-theme-primary));
      outline: none;

      &::placeholder {
        color: rgba(var(--v-theme-on-surface), 0.4);
      }
    }

    .suffix {
      display: flex;
      align-items: center;
      gap: 8px;

      .flags {
        color: rgba(var(--v-theme-on-surface), 0.6);
        font-family: monospace;
      }
    }
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    color: rgb(var(--v-theme-error));
    font-size: 0.875rem;
  }

  .success-message {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    color: rgb(var(--v-theme-success));
    font-size: 0.875rem;
  }
}
</style>
