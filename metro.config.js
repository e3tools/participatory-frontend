const { getDefaultConfig } = require('expo/metro-config')
/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql'); //allows us to import .sql files
module.exports = config;