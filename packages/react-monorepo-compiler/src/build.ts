import webpack from "webpack";
import prodConfig from "./webpack/webpack.config.prod";
import chalk from "chalk";
import { copyPublicFolder, emptyBuildFolder } from "./util";
import { buildFolder } from "./webpack/paths";
import {
  measureFileSizesBeforeBuild,
  FileSizes,
  printFileSizesAfterBuild
} from "react-dev-utils/FileSizeReporter";
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const printBuildError = require("react-dev-utils/printBuildError");

async function startBuild(
  compiler: webpack.Compiler,
  previousFileSizes: FileSizes
): Promise<{
  warnings: string[];
  stats: webpack.Stats;
  previousFileSizes: FileSizes;
}> {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: []
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== "string" ||
          process.env.CI.toLowerCase() !== "false") &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            "\nTreating warnings as errors because process.env.CI = true.\n" +
              "Most CI servers set it automatically.\n"
          )
        );
        return reject(new Error(messages.warnings.join("\n\n")));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings
      });
    });
  });
}

export async function buildApplication() {
  const compiler = webpack(prodConfig);

  const previousFileSizes = await measureFileSizesBeforeBuild(buildFolder);

  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

  emptyBuildFolder();
  copyPublicFolder();

  try {
    const { stats, warnings } = await startBuild(compiler, previousFileSizes);

    if (warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(warnings.join("\n\n"));
      console.log(
        "\nSearch for the " +
          chalk.underline(chalk.yellow("keywords")) +
          " to learn more about each warning."
      );
      console.log(
        "To ignore, add " +
          chalk.cyan("// eslint-disable-next-line") +
          " to the line before.\n"
      );
    } else {
      console.log();
      console.log(chalk.green("Compiled successfully.\n"));
    }

    console.log("File sizes after gzip:\n");
    printFileSizesAfterBuild(
      stats,
      previousFileSizes,
      buildFolder,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE
    );
    console.log();
  } catch (err) {
    chalk.red("Failed to compile.\n");
    printBuildError(err);
    process.exit(1);
  }
}
