# Steps

See https://docs.expo.dev/guides/monorepos/

- Ensure your folder structure has the following contents

* *apps*: Directory to hold different apps
* *packages*: Directory to hold different packages
* *package.json*. Root level file. The contents should be as below

```json
{
    ...,
    "private": true,
    "workspaces": ["apps/*", "packages/*"]
}  
```

### Create an app

``bash
yarn create expo apps/<APP_NAME>
```

* navigate to the app directory
* Modify the Metro config. Expo's Metro config has monorepo support for bun, npm, and yarn. You don't have to manually configure Metro when using monorepos if you use the config from expo/metro-config. If that's the case, you can skip this step. To configure a monorepo with Metro manually, there are two main changes:

1. Make sure Metro is watching all relevant code within the monorepo, not just apps/cool-app.
2. Tell Metro where it can resolve packages. They might be installed in apps/cool-app/node_modules or node_modules.
We can configure this by creating a metro.config.js with the following content:

```javascript

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

module.exports = config;

```

### Create a package

- Navigate to the root directory

```bash
mkdir -p packages/cool-package 
cd packages/cool-package
yarn init
```

### Using the package
Like standard packages, we need to add our cool-package as a dependency to our cool-app. The main difference between a standard package, and one from the monorepo, is you'll always want to use the "current state of the package" instead of a version. Let's add cool-package to our app by adding "cool-package": "*" to our app package.json file:

```json
{
  "name": "cool-app",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "cool-package": "*",
    "expo": "~50.0.0",
    "expo-status-bar": "~1.10.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.73.0",
    "react-native-web": "~0.19.6"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}

```

- After adding the package as a dependency, run *yarn install* to install or link the dependency to your app.

### Troubleshooting

If you encounter an error related to expo-router/index.js not existing, do the following (https://github.com/expo/router/issues/786#issuecomment-1636967623):

- Navigate to the directory containing the app

- Create an index.js and paste the following
```bash
import "expo-router/entry"
```
- In package.json, replace 
```json
"main": "expo-router/entry"
```
with 
```json
"main": "index.js"
```