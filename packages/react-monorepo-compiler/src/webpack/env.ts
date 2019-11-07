import fs from "fs";
import path from "path";
import { currentAppDirectory, isMonorepo, monorepoRootDir } from "./paths";
import dotenv from "dotenv";
import { isProduction } from "./utils";

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve("./paths")];

const NODE_ENV = process.env.NODE_ENV || "development";
if (!NODE_ENV) {
  throw new Error(
    "The NODE_ENV environment variable is required but was not specified."
  );
}

type EnvDict = {
  [key: string]: string;
};

const getMonorepoEnvironmentVars = (): EnvDict => {
  const monorepoEnvPath = (() => {
    if (isProduction()) {
      return path.resolve(monorepoRootDir, ".env.production");
    }

    return path.resolve(monorepoRootDir, ".env");
  })();

  if (isMonorepo && fs.existsSync(monorepoEnvPath)) {
    try {
      return dotenv.parse(fs.readFileSync(monorepoEnvPath));
    } catch (err) {
      throw new Error("Error parsing monorepo .env file");
    }
  }
  return {};
};

const getApplicationEnvironmentVars = (): EnvDict => {
  const appDotEnvPath = (() => {
    if (isProduction()) {
      return path.resolve(currentAppDirectory, ".env.production");
    }
    return path.resolve(currentAppDirectory, ".env");
  })();
  try {
    if (fs.existsSync(appDotEnvPath)) {
      return dotenv.parse(fs.readFileSync(appDotEnvPath));
    }

    return {};
  } catch (err) {
    throw new Error("Error parsing app .env file");
  }
};

export function getClientEnvironment(publicUrl: string) {
  const environmentKeys = {
    ...getMonorepoEnvironmentVars(),
    ...getApplicationEnvironmentVars()
  };

  // Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
  // injected into the application via DefinePlugin in Webpack configuration.
  const REACT_APP = /^REACT_APP_/i;

  const raw = Object.keys(environmentKeys)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env: { [key: string]: string }, key: string) => {
        env[key] = environmentKeys[key] as string;
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || "development",
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: publicUrl.startsWith("/") ? "" : "/"
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce(
      (env: { [key: string]: string }, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      },
      {}
    )
  };

  const envObject = { raw, stringified };
  return envObject;
}
