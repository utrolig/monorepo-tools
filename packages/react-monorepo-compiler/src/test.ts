import { createJestConfig } from "./jest/createJestConfig";
import resolve from "resolve";
import jest from "jest";
import path from "path";
import { execSync } from "child_process";
import { srcFolder } from "./webpack/paths";

export function runTests() {
  console.log("Running tests...");
  process.env.BABEL_ENV = "test";
  process.env.NODE_ENV = "test";
  process.env.PUBLIC_URL = "";

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on("unhandledRejection", err => {
    throw err;
  });

  // Ensure environment variables are read.
  // require("../config/env");

  let argv = process.argv.slice(2);

  function isInGitRepository() {
    try {
      execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  }

  function isInMercurialRepository() {
    try {
      execSync("hg --cwd . root", { stdio: "ignore" });
      return true;
    } catch (e) {
      return false;
    }
  }

  // Watch unless on CI or explicitly running all tests
  if (!process.env.CI && argv.indexOf("--watchAll") === -1) {
    // https://github.com/facebook/create-react-app/issues/5210
    const hasSourceControl = isInGitRepository() || isInMercurialRepository();
    argv.push(hasSourceControl ? "--watch" : "--watchAll");
  }

  // @remove-on-eject-begin
  // This is not necessary after eject because we embed config into package.json.
  argv.push(
    "--config",
    JSON.stringify(
      createJestConfig(
        (relativePath: string) => path.resolve(__dirname, relativePath),
        path.resolve(srcFolder, "..")
      )
    )
  );

  // This is a very dirty workaround for https://github.com/facebook/jest/issues/5913.
  // We're trying to resolve the environment ourselves because Jest does it incorrectly.
  // TODO: remove this as soon as it's fixed in Jest.
  function resolveJestDefaultEnvironment(name: string) {
    const jestDir = path.dirname(
      resolve.sync("jest", {
        basedir: __dirname
      })
    );
    const jestCLIDir = path.dirname(
      resolve.sync("jest-cli", {
        basedir: jestDir
      })
    );
    const jestConfigDir = path.dirname(
      resolve.sync("jest-config", {
        basedir: jestCLIDir
      })
    );
    return resolve.sync(name, {
      basedir: jestConfigDir
    });
  }
  let cleanArgv: Array<string> = [];
  let env: string = "jsdom";
  let next: string;
  do {
    next = argv.shift() as string;
    if (next === "--env") {
      env = argv.shift() as string;
    } else if (next!.indexOf("--env=") === 0) {
      env = next!.substring("--env=".length);
    } else {
      cleanArgv.push(next);
    }
  } while (argv.length > 0);
  argv = cleanArgv;
  let resolvedEnv;
  try {
    resolvedEnv = resolveJestDefaultEnvironment(`jest-environment-${env}`);
  } catch (e) {
    // ignore
  }
  if (!resolvedEnv) {
    try {
      resolvedEnv = resolveJestDefaultEnvironment(env);
    } catch (e) {
      // ignore
    }
  }
  const testEnvironment = resolvedEnv || env;
  argv.push("--env", testEnvironment);
  // @remove-on-eject-end
  jest.run(argv);
}
