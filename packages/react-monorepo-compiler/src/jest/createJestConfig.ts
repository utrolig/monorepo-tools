import fs from "fs";
import chalk from "chalk";
import { testsSetup, appPkgJson, moduleFileExtensions } from "../paths";

export const createJestConfig = (
  resolve: (path: string) => string,
  rootDir: string
) => {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  const setupTestsMatches = testsSetup.match(/src[/\\]setupTests\.(.+)/);
  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || "js";
  const setupTestsFile = fs.existsSync(testsSetup)
    ? `<rootDir>/src/setupTests.${setupTestsFileExtension}`
    : undefined;

  const config: {
    [key: string]: any;
  } = {
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],

    setupFiles: [require.resolve("react-app-polyfill/jsdom")],

    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    testEnvironment: "jest-environment-jsdom-fourteen",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": resolve("jest/babelTransform.js"),
      "^.+\\.css$": resolve("jest/cssTransform.js"),
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": resolve("jest/fileTransform.js")
    },
    transformIgnorePatterns: [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: [],
    moduleNameMapper: {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: [...moduleFileExtensions, "node"].filter(
      ext => !ext.includes("mjs")
    ),
    watchPlugins: [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ]
  };
  if (rootDir) {
    config.rootDir = rootDir;
  }
  const overrides = Object.assign({}, require(appPkgJson).jest);
  const supportedKeys = [
    "collectCoverageFrom",
    "coverageReporters",
    "coverageThreshold",
    "extraGlobals",
    "globalSetup",
    "globalTeardown",
    "moduleNameMapper",
    "resetMocks",
    "resetModules",
    "snapshotSerializers",
    "transform",
    "transformIgnorePatterns",
    "watchPathIgnorePatterns"
  ];
  if (overrides) {
    supportedKeys.forEach(key => {
      if (overrides.hasOwnProperty(key)) {
        if (Array.isArray(config[key]) || typeof config[key] !== "object") {
          // for arrays or primitive types, directly override the config key
          config[key] = overrides[key];
        } else {
          // for object types, extend gracefully
          config[key] = Object.assign({}, config[key], overrides[key]);
        }

        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      const isOverridingSetupFile =
        unsupportedKeys.indexOf("setupFilesAfterEnv") > -1;

      if (isOverridingSetupFile) {
        console.error(
          chalk.red(
            "We detected " +
              chalk.bold("setupFilesAfterEnv") +
              " in your package.json.\n\n" +
              "Remove it from Jest configuration, and put the initialization code in " +
              chalk.bold("src/setupTests.js") +
              ".\nThis file will be loaded automatically.\n"
          )
        );
      } else {
        console.error(
          chalk.red(
            "\nOut of the box, Create React App only supports overriding " +
              "these Jest options:\n\n" +
              supportedKeys
                .map(key => chalk.bold("  \u2022 " + key))
                .join("\n") +
              ".\n\n" +
              "These options in your package.json Jest configuration " +
              "are not currently supported by Create React App:\n\n" +
              unsupportedKeys
                .map(key => chalk.bold("  \u2022 " + key))
                .join("\n") +
              "\n\nIf you wish to override other Jest options, you need to " +
              "eject from the default setup. You can do so by running " +
              chalk.bold("npm run eject") +
              " but remember that this is a one-way operation. " +
              "You may also file an issue with Create React App to discuss " +
              "supporting more options out of the box.\n"
          )
        );
      }

      process.exit(1);
    }
  }
  return config;
};
