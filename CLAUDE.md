| Category  | Package              |
| --------- | -------------------- |
| Framework | Vue 3@latest, Vite 7 |
| UI        | Vuetify              |
| State     | Pinia                |
| Utils     | @vueuse/core         |
| Icons     | MDI (@mdi/font)      |

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
- Path aliases: @/ = client/src

```bash
.
└── client/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── App.vue
        ├── main.ts
        ├── router.ts
        ├── style.scss
        ├── vite-env.d.ts
        ├── components/
        │   └── regex-game/
        │       ├── game-board.vue
        │       ├── level-indicator.vue
        │       ├── regex-features.ts
        │       ├── regex-input.vue
        │       ├── regex-legend.vue
        │       ├── success-modal.vue
        │       └── target-display.vue
        ├── pages/
        │   ├── Game/
        │   │   └── game.vue
        │   └── Settings/
        │       └── settings.vue
        ├── store/
        │   └── text.store.ts
        └── utils/
            └── vuetify.ts
```
