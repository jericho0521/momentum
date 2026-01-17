const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add js to asset extensions so Metro serves PDF.js from public folder
config.resolver.assetExts.push('min.js');

module.exports = config;
