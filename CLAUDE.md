| Category  | Package              |
| --------- | -------------------- |
| Framework | Vue 3@latest, Vite 7 |
| System    | Vuetify              |
| Store/Api | Pinia + dr-fetch     |
| Utils     | @vueuse/core,        |
| Icons     | Remixicon            |

---

Style Guide

Component Structure:

  <script setup lang="ts">
  // imports, props, composables, logic
  </script>

<template>...</template>

  <style lang="scss">...</style>

Conventions:

- Files: kebab-case (add-item.vue, config.store.ts)
- Script: <script setup lang="ts"> (Composition API + TS)
- Props: defineProps<Props>() with interface
- Stores: Pinia with use prefix (useConfig)
- Styles: SCSS, non-scoped (component-specific selectors)
- Path aliases: @/ = client/src, ~/ = project root

```bash
.
└── client/
    ├── index.html
    ├── src/
    │   ├── App.vue
        └── pages/
            └── Game/
            └── Settings/
    │   ├── main.ts
    │   ├── router.ts
    │   ├── style.scss
    │   └── vite-env.d.ts
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```
