import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { templatePath, tsLintConfig } from "./paths";
import {
  isProduction,
  isTypescriptApp,
  getConfigOrCreateIfNotExists
} from "./utils";
import webpack from "webpack";
import { getClientEnvironment } from "./env";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ForkTsCheckerPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

const env = getClientEnvironment("/");
// This is added to support dynamic publicUrl in the future.
export const envPlugin = new webpack.DefinePlugin(env.stringified);

export const interpolateHtmlPlugin = new InterpolateHtmlPlugin(
  HtmlWebpackPlugin,
  env.raw
);

export const miniCssPlugin = new MiniCssExtractPlugin({
  filename: "static/css/[name].[contenthash:8].css",
  chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  template: templatePath
});

export const forkTsCheckerPlugin = new ForkTsCheckerPlugin({
  async: !isProduction(),
  useTypescriptIncrementalApi: true,
  tsconfig: getConfigOrCreateIfNotExists(),
  tslint: isTypescriptApp() ? tsLintConfig : undefined
});
