import { RuleSetRule } from "webpack";
import autoprefixer from "autoprefixer";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import eslint from "eslint";
import { isProduction, isContinousIntegration } from "./utils";
import {
  srcFolder,
  getAppEntryFile,
  eslintPluginResolutionPath
} from "./paths";

export const eslintRule: RuleSetRule = {
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  enforce: "pre",
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve("eslint-loader"),
      options: {
        formatter: require.resolve("react-dev-utils/eslintFormatter"),
        eslintPath: require.resolve("eslint"),
        resolvePluginsRelativeTo: eslintPluginResolutionPath,
        baseConfig: (() => {
          const eslintCli = new eslint.CLIEngine({});
          let eslintConfig;

          try {
            const entryFilePath = getAppEntryFile(srcFolder);
            eslintConfig = eslintCli.getConfigForFile(entryFilePath);
          } catch (e) {
            console.log(
              "No ESLint configuration found, falling back to default."
            );
            eslintConfig = {
              extends: [require.resolve("eslint-config-react-app")]
            };
          }
          return eslintConfig;
        })()
      }
    }
  ]
};

const getStyleLoader = (cssOptions: any, preProcessor?: string) => {
  const isDevelopment = !isProduction();
  const styleOrMiniCssLoader = (() => {
    if (isDevelopment) {
      return {
        loader: require.resolve("style-loader"),
        options: { injectType: "styleTag" }
      };
    }

    return {
      loader: MiniCssExtractPlugin.loader as any,
      options: { publicPath: "../../" }
    };
  })();
  const loaders: any = [
    styleOrMiniCssLoader,
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          // tslint:disable-next-line:no-implicit-dependencies
          require("postcss-flexbugs-fixes"),
          autoprefixer()
        ]
      }
    }
  ].filter(Boolean);

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isDevelopment
        }
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true
        }
      }
    );
  }

  return loaders;
};

export const sassRule = {
  test: /\.(scss|sass)$/,
  use: getStyleLoader(
    { importLoaders: 2, sourceMap: !isProduction() },
    "sass-loader"
  )
};

export const cssRule: RuleSetRule = {
  test: /\.css$/,
  use: getStyleLoader({ importLoaders: 1, sourceMap: !isProduction() })
};

export const fileRule: RuleSetRule = {
  // Exclude `js` files to keep "css" loader working as it injects
  // it's runtime that would otherwise processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/\.(ts|tsx)$/, /\.js$/, /\.html$/, /\.json$/, /\.css$/],
  oneOf: [],
  loader: require.resolve("file-loader"),
  options: {
    name: "static/media/[name].[hash:8].[ext]"
  }
};

const getRemoveTestAttributesPlugin = () => {
  const testAttributeRemovalPlugin = [
    require.resolve("babel-plugin-jsx-remove-data-test-id"),
    {
      attributes: ["data-test-element", "data-test-id"]
    }
  ];

  if (isProduction() && !isContinousIntegration()) {
    return testAttributeRemovalPlugin;
  }

  return false;
};

export const externalBabelRule: RuleSetRule = {
  test: /\.(js|mjs)$/,
  exclude: /@babel(?:\/|\\{1,2})runtime/,
  loader: require.resolve("babel-loader"),
  options: {
    babelrc: false,
    configFile: false,
    compact: false,
    presets: [
      [
        require.resolve("babel-preset-react-app/dependencies"),
        { helpers: true }
      ]
    ],
    sourceMaps: !isProduction(),
    inputSourceMap: !isProduction()
  }
};

export const babelRule: RuleSetRule = {
  test: /\.(ts|tsx|js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: require.resolve("babel-loader"),
    options: {
      presets: [
        require.resolve("@babel/preset-env"),
        require.resolve("@babel/preset-typescript"),
        require.resolve("@babel/preset-react")
      ],
      plugins: [
        require.resolve("@babel/plugin-proposal-class-properties"),
        require.resolve("@babel/plugin-proposal-object-rest-spread"),
        require.resolve("@babel/plugin-transform-runtime"),
        require.resolve("@babel/plugin-syntax-dynamic-import"),
        getRemoveTestAttributesPlugin()
      ].filter(Boolean)
    }
  }
};
