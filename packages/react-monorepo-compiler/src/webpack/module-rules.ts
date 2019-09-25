import { RuleSetRule } from "webpack";
import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { isProduction } from "./utils";

export const eslintRule: RuleSetRule = {
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  enforce: "pre",
  exclude: /node_modules/,
  use: [
    {
      loader: require.resolve("eslint-loader"),
      options: {
        formatter: require.resolve("react-dev-utils/eslintFormatter"),
        eslintPath: require.resolve("eslint")
      }
    }
  ]
};

export const cssRule: RuleSetRule = {
  test: /\.css$/,
  use: [
    isProduction()
      ? {
          loader: MiniCssExtractPlugin.loader as any,
          options: { publicPath: "../../" }
        }
      : require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1
      }
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
  ]
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
        require.resolve("@babel/plugin-syntax-dynamic-import")
      ]
    }
  }
};
