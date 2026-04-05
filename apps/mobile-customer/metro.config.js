const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Only watch shared packages, not the entire monorepo (saves memory)
config.watchFolders = [
  path.resolve(monorepoRoot, "packages"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Resolve packages from both the project and monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Prevent Metro from resolving duplicate packages from the web app
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
