import { Configuration } from "webpack";
import { getEntryPoint } from "./utils";
import { babelRule, cssRule, fileRule } from "./module-rules";
import { srcFolder, getAliasPaths, appNodeModules } from "./paths";
import path from "path";

// const myNodeModulesPath = path.resolve(__dirname, "../../node_modules");
// console.log("myNodeModulesPath", myNodeModulesPath);

const config: Configuration = {
  entry: getEntryPoint(srcFolder),
  context: srcFolder,
  resolve: {
    alias: getAliasPaths(),
    extensions: [".tsx", ".ts", ".jsx", ".js"]
    // modules: [myNodeModulesPath, appNodeModules]
  },
  module: {
    rules: [babelRule, cssRule, fileRule]
  }
};

export default config;
