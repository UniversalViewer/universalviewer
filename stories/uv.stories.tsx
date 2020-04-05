/** @jsx h */
import { h } from 'jsx-dom';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { Viewer } from '../src/index';

export default { title: 'Universal Viewer',   decorators: [withKnobs] };

type Data = {
  manifestUri: string,
  configUri?: string,
  collectionIndex?: number,
  manifestIndex?: number,
  sequenceIndex?: number,
  canvasIndex?: number,
  rangeId?: number,
  rotation?: number,
  xywh?: string,
  embedded?: boolean,
  locales?: any, //??
};

const UVDemo = (data: Data) => {
  const container = <div style={{ width: '100%', height: '100vh', minHeight: 500 }} /> as HTMLElement;

  const uv = new Viewer({
    target: container,
    data
  });

  uv.on('created', () => {
    uv.resize();
  }, {});

  return container;
};


export const ScottishBridges = () => {
  const manifestUri = text('Manifest URI', 'https://view.nls.uk/manifest/7446/74464117/manifest.json');
  const canvasIndex = number('Canvas Index', 30);

  return <UVDemo manifestUri={manifestUri} canvasIndex={canvasIndex || 0} />
};

export const Wunder = () => {
  const manifestUri = text('Manifest URI', 'https://wellcomelibrary.org/iiif/b18035723/manifest');
  const canvasIndex = number('Canvas Index', 0);

  return <UVDemo manifestUri={manifestUri} canvasIndex={canvasIndex || 0} />
}
