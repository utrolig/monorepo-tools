import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { templatePath, tsConfig, tsLintConfig } from "./paths";
const ForkTsCheckerPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");

export const miniCssPlugin = new MiniCssExtractPlugin({
  filename: "assets/css/[name].css",
  chunkFilename: "assets/css/[name].chunk.css"
});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  template: templatePath
});

export const cleanDistFolderPlugin = new CleanWebpackPlugin();

export const forkTsCheckerPlugin = new ForkTsCheckerPlugin({
  async: true,
  useTypescriptIncrementalApi: true,
  tsconfig: tsConfig,
  tslint: tsLintConfig
});
