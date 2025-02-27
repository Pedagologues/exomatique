import type { Preview, SvelteRenderer } from '@storybook/svelte'
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { i18n } from "../src/lib/i18n";
import { availableLanguageTags } from "../src/lib/paraglide/runtime";

import '../src/app.css'

import Wrapper from './Wrapper.svelte';
import { lang_store } from "./storybook_store"

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: availableLanguageTags.map((lang) => ({ value: lang, title: lang.toUpperCase() })),
      showName: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [(storyFn, context) => {
    lang_store.set(context.globals.locale);
    return Wrapper
  }, withThemeByDataAttribute<SvelteRenderer>({
    themes: {
      cerberus: 'cerberus'
    },
    defaultTheme: 'cerberus',
    parentSelector: 'body',
    attributeName: 'data-theme'
  })],
};

export default preview;