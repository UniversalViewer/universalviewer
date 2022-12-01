import '../src/content-handlers/iiif/modules/uv-shared-module/css/variables.less';
import { addDecorator } from '@storybook/react';

addDecorator(storyFn => (
    <div className="uv">
      {storyFn()}
    </div>
))
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
