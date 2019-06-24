import babelJest from "babel-jest";
import { babelRule } from "../webpack/module-rules";

const transformer = babelJest.createTransformer({
  presets: [(babelRule as any).use.options],
  babelrc: false,
  configFile: false
});

module.exports = transformer;
