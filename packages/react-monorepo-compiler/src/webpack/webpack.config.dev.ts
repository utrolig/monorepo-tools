import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import { htmlWebpackPlugin } from "./plugins";

const extendedConfig: Configuration = {
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [htmlWebpackPlugin]
};

export default merge(baseConfig, extendedConfig);
