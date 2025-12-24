import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import * as directives from "vuetify/directives";
import * as components from "vuetify/components";

export default createVuetify({
  blueprint: md3,
  components,
  directives,
  aliases: {
    VCardInfo: components.VCard,
    VCardOutlined: components.VCard,
    VChipInfo: components.VChip,
  },
  defaults: {
    VCardInfo: {
      variant: "tonal",
      color: "secondary",
      rounded: "lg",
      VChip: {
        variant: "tonal",
        color: "secondary",
        size: "small",
      },
    },
    VChipInfo: {
      variant: "tonal",
      color: "secondary",
      size: "small",
    },
    VCardOutlined: {
      variant: "outlined",
      rounded: "xl",
      color: "surface",
      class: "backdrop-blur-xl !bg-slate-900/60 !border-slate-500/30",
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#0f172a",
          surface: "#1e293b",
          primary: "#22d3ee",
          secondary: "#a855f7",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    },
  },
});
