import baseConfig from "./webpack.config.base";
import { Configuration } from "webpack";
import merge from "webpack-merge";
import {
  htmlWebpackPlugin,
  forkTsCheckerPlugin,
  miniCssPlugin,
  envPlugin,
  interpolateHtmlPlugin
} from "./plugins";
import TerserPlugin from "terser-webpack-plugin";
import isWsl from "is-wsl";
import { buildFolder, srcFolder } from "./paths";
import safePostCssParser from "postcss-safe-parser";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import { getEntryPoint, getMonacoEntryPoints } from "./utils";

const extendedConfig: Configuration = {
  entry: {
    app: getEntryPoint(srcFolder),
    ...getMonacoEntryPoints(srcFolder)
  },
  mode: "production",
  devtool: "source-map",
  bail: true,
  output: {
    path: buildFolder,
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename: "static/js/[name].[contenthash:8].js"
  },
  optimization: {
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: true
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: true
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true
              }
            : false
        }
      })
    ]
  },
  plugins: [
    envPlugin,
    miniCssPlugin,
    htmlWebpackPlugin,
    interpolateHtmlPlugin,
    forkTsCheckerPlugin
  ]
};

export default merge(baseConfig, extendedConfig);
