import { Configuration } from "webpack";
import { getEntryPoint } from "./utils";
import { babelRule, cssRule, fileRule } from "./module-rules";
import { srcFolder, getAliasPaths } from "./paths";

const config: Configuration = {
  entry: getEntryPoint(srcFolder),
  context: srcFolder,
  resolve: {
    alias: getAliasPaths(),
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  module: {
    rules: [babelRule, cssRule, fileRule]
  }
};

export default config;
