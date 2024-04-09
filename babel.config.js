module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // "plugins": [
    //   [
    //     "module-resolver",
    //     {
    //       "root": "./app",
    //       "alias": {
    //         "assets": "./assets",
    //         "components": "./app/components",
    //         "constants": "./app/constants",
    //         "interfaces": './app/interfaces',
    //         "utils": './app/utils',
    //         "backends": './app/backends',
    //         "contexts": './app/contexts',
    //         "styles": "./app/styles",
    //         "services": "./app/services",
    //         "stores": "./app/stores",
    //         "translations": "./app/translations",
    //         "screens": "./app/screens",
    //         "views": "./app/views",
    //         "ui": "./app/ui"
    //       }
    //     }
    //   ]
    //]
  };
};
