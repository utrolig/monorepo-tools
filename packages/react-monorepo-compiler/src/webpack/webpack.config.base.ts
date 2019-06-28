import { Configuration } from "webpack";
import { getEntryPoint } from "./utils";
import { babelRule, cssRule, fileRule } from "./module-rules";
import { srcFolder, getAliasPaths } from "./paths";

const config: Configuration = {
  context: srcFolder,
  resolve: {
    alias: getAliasPaths(),
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  module: {
    rules: [babelRule, cssRule, fileRule]
  },
  performance: false,
  node: {
    module: "empty",
    dgram: "empty",
    dns: "mock",
    fs: "empty",
    http2: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};

export default config;
