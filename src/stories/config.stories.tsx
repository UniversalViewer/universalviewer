import React from "react";
import UniversalViewer from "./UniversalViewer";

export default {
  component: UniversalViewer,
  title: 'Config',
  argTypes: {
    // autoPlay: {
    //   options: [true, false],
    //   control: { type: 'radio' },
    // },
    // duration: {
    //   defaultValue: '',
    //   control: { type: 'text' },
    // },
    iiifManifestId: {
      defaultValue: 'https://iiif.wellcomecollection.org/presentation/v2/b18035723',
      control: { type: 'text' },
    },
    leftPanelEnabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
    // muted: {
    //   options: [true, false],
    //   control: { type: 'radio' },
    // },
    // target: {
    //   defaultValue: '',
    //   control: { type: 'text' },
    // },
    // rotation: {
    //   options: [0, 90, 180, 270],
    //   control: { type: 'select' },
    // },
    // youTubeVideoId: {
    //   defaultValue: '',
    //   control: { type: 'text' },
    // },
  },
};

const Template = args => <UniversalViewer {...args} />;

export const IIIFConfig = Template.bind({});

IIIFConfig.args = {
  // autoPlay: false,
  iiifManifestId: 'https://iiif.wellcomecollection.org/presentation/v2/b18035723',
  leftPanelEnabled: true,
  // muted: false,
  // rotation: 0,
};