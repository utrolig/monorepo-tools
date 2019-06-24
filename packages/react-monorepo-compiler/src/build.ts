import webpack from "webpack";
import prodConfig from "./webpack/webpack.config.prod";
import chalk from "chalk";

export function buildApplication() {
  const compiler = webpack(prodConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      let messages: { warnings: string[]; errors: string[] } = {
        warnings: [],
        errors: []
      };
      // if (err) {
      //   if (!err.message) {
      //     return reject(err);
      //   }
      //   messages = formatWebpackMessages({
      //     errors: [err.message],
      //     warnings: [],
      //   });
      // } else {
      //   messages = formatWebpackMessages(
      //     stats.toJson({ all: false, warnings: true, errors: true })
      //   );
      // }
      // if (messages.errors.length) {
      //   // Only keep the first error. Others are often indicative
      //   // of the same problem, but confuse the reader with noise.
      //   if (messages.errors.length > 1) {
      //     messages.errors.length = 1;
      //   }
      //   return reject(new Error(messages.errors.join('\n\n')));
      // }
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
        previousFileSizes: 0,
        warnings: messages.warnings
      });
    });
  });
}
