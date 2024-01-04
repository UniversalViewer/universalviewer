// export { State } from "vite-react-ts-button-test-project";
// export { getStore } from "vite-react-ts-button-test-project";

import { create } from "zustand";

export type State = {
  ambientLightIntensity: number;
  setAmbientLightIntensity: (ambientLightIntensity: number) => void;
};

export const getStore = create<State>((set) => ({
  ambientLightIntensity: 0,

  setAmbientLightIntensity: (ambientLightIntensity: number) =>
    set({
      ambientLightIntensity,
    }),
}));

// const useStore = create<State>((set) => ({
//   ambientLightIntensity: 0,

//   setAmbientLightIntensity: (ambientLightIntensity: number) =>
//     set({
//       ambientLightIntensity,
//     }),
// }));

// if (process.env.NODE_ENV === 'development') {
//   console.log('zustand devtools');
//   mountStoreDevtool('Store', useStore);
// }

// export default getStore;
