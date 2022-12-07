import React from "react";
import UniversalViewer from "./UniversalViewer";

export default {
  component: UniversalViewer,
  title: 'Config',
  argTypes: {
    // iiifManifestId: {
    //   options: ['https://iiif.wellcomecollection.org/presentation/v2/b18035723'],
    //   control: { type: 'select' },
    // },
    autoPlay: {
      options: [true, false],
      control: { type: 'radio' },
    },
    duration: {
      defaultValue: '',
      control: { type: 'text' },
    },
    iiifConfig: {
      disable: true,
    },
    iiifManifestId: {
      defaultValue: 'https://iiif.wellcomecollection.org/presentation/v2/b18035723',
      control: { type: 'text' },
    },
    leftPanelEnabled: {
      options: [true, false],
      control: { type: 'radio' },
    },
    muted: {
      options: [true, false],
      control: { type: 'radio' },
    },
    target: {
      defaultValue: '',
      control: { type: 'text' },
    },
    rotation: {
      options: [0, 90, 180, 270],
      control: { type: 'select' },
    },
    youTubeConfig: {
      disable: true,
    },
    youTubeVideoId: {
      defaultValue: '',
      control: { type: 'text' },
    },
  },
};

const Template = args => <UniversalViewer {...args} />;

export const Default = Template.bind({});

Default.args = {
  autoPlay: false,
  iiifManifestId: 'https://iiif.wellcomecollection.org/presentation/v2/b18035723',
  muted: false,
  rotation: 0,
};

// export const Pinned = Template.bind({});
// Pinned.args = {
//   task: {
//     ...Default.args.task,
//     state: 'TASK_PINNED',
//   },
// };

// export const Archived = Template.bind({});
// Archived.args = {
//   task: {
//     ...Default.args.task,
//     state: 'TASK_ARCHIVED',
//   },
// };

// export const ConfigStory = () => {

//   return (
//     <UniversalViewer iiifManifestId="https://iiif.wellcomecollection.org/presentation/v2/b18035723" />
//   );
// }

