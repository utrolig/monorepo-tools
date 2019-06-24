import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { templatePath, tsConfig, tsLintConfig } from "./paths";
import { isProduction } from "./utils";
const ForkTsCheckerPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

export const miniCssPlugin = new MiniCssExtractPlugin({
  filename: "static/css/[name].[contenthash:8].css",
  chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  template: templatePath
});

export const cleanPublicFolderPlugin = new CleanWebpackPlugin();

export const forkTsCheckerPlugin = new ForkTsCheckerPlugin({
  async: !isProduction(),
  useTypescriptIncrementalApi: true,
  tsconfig: tsConfig,
  tslint: tsLintConfig
});
