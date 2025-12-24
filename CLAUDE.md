| Category  | Package              |
| --------- | -------------------- |
| Framework | Astro, Vue 3         |
| UI        | Vuetify              |
| State     | Pinia                |
| Utils     | @vueuse/core         |
| Icons     | MDI (@mdi/font)      |
| Styling   | Tailwind, SCSS       |

---

Style Guide

Component Structure:

```vue
<script setup lang="ts">
// imports, props, composables, logic
</script>

<template>...</template>

<style lang="scss">...</style>
```

Conventions:

- Files: kebab-case (game-board.vue, regex-features.ts)
- Script: <script setup lang="ts"> (Composition API + TS)
- Props: defineProps<Props>() with interface
- Stores: Pinia with use prefix (useConfig)
- Styles: SCSS, non-scoped (component-specific selectors)
- Path aliases: @/ = src

```bash
.
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
└── src/
    ├── components/
    │   ├── pages/
    │   │   ├── game.vue
    │   │   └── settings.vue
    │   ├── regex-game/
    │   │   ├── game-board.vue
    │   │   ├── level-indicator.vue
    │   │   ├── regex-features.ts
    │   │   ├── regex-input.vue
    │   │   ├── regex-legend.vue
    │   │   ├── success-modal.vue
    │   │   └── target-display.vue
    │   └── theme-toggle.vue
    ├── layouts/
    │   └── Layout.astro
    ├── pages/
    │   ├── _app.ts
    │   ├── index.astro
    │   └── settings.astro
    ├── store/
    │   └── text.store.ts
    ├── styles/
    │   └── global.css
    └── utils/
        └── vuetify.ts
```
