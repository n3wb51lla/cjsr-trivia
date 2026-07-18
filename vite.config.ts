import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const COLOR_TOKENS = [
  'brandRed', 'brandRedLight', 'brandBlack', 'brandSurface',
  'brandInk', 'brandCorrect', 'brandYellow', 'brandCyan', 'brandPaper',
] as const;

const CSS_VAR_NAMES: Record<(typeof COLOR_TOKENS)[number], string> = {
  brandRed: '--color-brand-red',
  brandRedLight: '--color-brand-red-light',
  brandBlack: '--color-brand-black',
  brandSurface: '--color-brand-surface',
  brandInk: '--color-brand-ink',
  brandCorrect: '--color-brand-correct',
  brandYellow: '--color-brand-yellow',
  brandCyan: '--color-brand-cyan',
  brandPaper: '--color-brand-paper',
};

function instanceBrandingPlugin(): Plugin {
  return {
    name: 'instance-branding',
    transformIndexHtml: {
      // Must run before Vite's built-in HTML plugin extracts <style> tag
      // content into the CSS pipeline, or __BRAND_COLORS__ gets parsed as
      // invalid CSS before this plugin ever gets a chance to replace it.
      order: 'pre',
      handler(html) {
        const configPath = fileURLToPath(new URL('./src/config/instance.config.json', import.meta.url));
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));

        const darkRules: string[] = ['color-scheme: dark;'];
        const lightRules: string[] = ['color-scheme: light;'];
        for (const token of COLOR_TOKENS) {
          const entry = config.colors?.[token];
          if (!entry?.dark || !entry?.light) {
            throw new Error(`instance.config.json: colors.${token} must have "dark" and "light" hex values.`);
          }
          const varName = CSS_VAR_NAMES[token];
          darkRules.push(`${varName}: ${entry.dark};`);
          if (entry.light !== entry.dark) lightRules.push(`${varName}: ${entry.light};`);
        }
        const brandColorsCss = `:root { ${darkRules.join(' ')} } :root[data-theme='light'] { ${lightRules.join(' ')} }`;

        return html
          .replace('__SITE_TITLE__', escapeHtml(config.siteTitle))
          .replace('__THEME_COLOR__', escapeHtml(config.colors.brandRed.dark))
          .replace('__THEME_STORAGE_KEY__', config.themeStorageKey)
          .replace('__BRAND_COLORS__', brandColorsCss);
      },
    },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default defineConfig({
  plugins: [react(), instanceBrandingPlugin()],
});
