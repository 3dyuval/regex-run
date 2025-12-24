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
      class: "backdrop-blur-xl",
      style:
        "background: rgba(var(--v-theme-surface), 0.6); border-color: rgba(var(--v-theme-on-surface), 0.15)",
    },
  },
  theme: {
    defaultTheme:
      typeof localStorage !== "undefined"
        ? localStorage.getItem("theme") || "dark"
        : "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#0d4247",
          surface: "#0d1516",
          primary: "#4a9e9e",
          secondary: "#d4722c",
          success: "#4a9e9e",
          warning: "#d4a43c",
          error: "#c04535",
          info: "#3d8a8a",
          "on-background": "#d4c898",
          "on-surface": "#d4c898",
        },
      },
      light: {
        dark: false,
        colors: {
          background: "#f5f0e6",
          surface: "#ebe5d8",
          primary: "#2d7a7a",
          secondary: "#c06525",
          success: "#2d7a7a",
          warning: "#c49432",
          error: "#a83a2d",
          info: "#2d6a6a",
          "on-background": "#1a4045",
          "on-surface": "#1a4045",
        },
      },
    },
  },
});
