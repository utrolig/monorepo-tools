import { Configuration } from "webpack";
import { babelRule, cssRule, fileRule, eslintRule } from "./module-rules";
import { srcFolder, getAliasPaths } from "./paths";

const config: Configuration = {
  context: srcFolder,
  resolve: {
    alias: getAliasPaths(),
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  },
  module: {
    rules: [eslintRule, { oneOf: [babelRule, cssRule, fileRule] }]
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
