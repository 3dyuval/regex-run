import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import * as components from 'vuetify/components';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0f172a',
          surface: '#1e293b',
          primary: '#22d3ee',
          secondary: '#a855f7',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      }
    }
  }
});
