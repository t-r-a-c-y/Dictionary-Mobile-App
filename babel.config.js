// Babel config for Expo SDK 54.
// `babel-preset-expo` automatically applies the Reanimated/Worklets Babel
// plugin when those packages are installed, so no manual plugin entry is needed.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
