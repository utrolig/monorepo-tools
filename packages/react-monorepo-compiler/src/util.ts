import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import { publicFolder, buildFolder, templatePath } from "./webpack/paths";
import fs from "fs-extra";

export function emptyBuildFolder() {
  fs.emptyDirSync(buildFolder);
}

export function copyPublicFolder() {
  fs.copySync(publicFolder, buildFolder, {
    dereference: true,
    filter: file => file !== templatePath
  });
}

export function clearConsole() {
  process.stdout.write(
    process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
  );
}

export function ensureProperClose(devServer: WebpackDevServer) {
  const closedevServerAndExit = () => {
    console.log(`Received ${chalk.green("close")} signal, closing server.`);
    devServer.close();
    process.exit();
  };
  process.on("SIGINT", closedevServerAndExit);
  process.on("SIGTERM", closedevServerAndExit);
}
