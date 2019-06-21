import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { templatePath } from "./paths";

export const miniCssPlugin = new MiniCssExtractPlugin({
  filename: "assets/css/[name].css",
  chunkFilename: "assets/css/[name].chunk.css"
});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  template: templatePath
});

export const cleanDistFolderPlugin = new CleanWebpackPlugin();
