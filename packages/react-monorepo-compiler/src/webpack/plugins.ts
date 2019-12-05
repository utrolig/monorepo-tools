import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import {
  templatePath,
  tsLintConfig,
  appNodeModules,
  reactBuildArtifactsNameTemplateString
} from "./paths";
import resolve from "resolve";
import { isProduction, getConfigOrCreateIfNotExists } from "./utils";
import webpack from "webpack";
import { getClientEnvironment } from "./env";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ForkTsCheckerPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const env = getClientEnvironment("/");
// This is added to support dynamic publicUrl in the future.
export const envPlugin = new webpack.DefinePlugin(env.stringified);

export const interpolateHtmlPlugin = new InterpolateHtmlPlugin(
  HtmlWebpackPlugin,
  env.raw
);

export const miniCssPlugin = new MiniCssExtractPlugin({
  filename: `${reactBuildArtifactsNameTemplateString}.css`,
  chunkFilename: `${reactBuildArtifactsNameTemplateString}.chunk.css`
});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  inject: true,
  template: templatePath
});

export const forkTsCheckerPlugin = new ForkTsCheckerPlugin({
  async: !isProduction(),
  checkSyntacticErrors: true,
  useTypescriptIncrementalApi: true,
  formatter: isProduction() ? typescriptFormatter : undefined,
  tsconfig: getConfigOrCreateIfNotExists(),
  typescript: resolve.sync("typescript", { basedir: appNodeModules }),
  reportFiles: [
    "**",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/?(*.)(spec|test).*",
    "!**/src/setupProxy.*",
    "!**/src/setupTests.*"
  ],
  silent: true
});
