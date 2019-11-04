import fs from "fs";
import path from "path";
import { srcFolder, currentAppDirectory } from "./paths";
import { appPkgJson } from "../paths";

export const isProduction = () => {
  const isProdEnv = process.env.NODE_ENV === "production";
  return isProdEnv;
};

export const isContinousIntegration = () => {
  const isCiEnv = process.env.CI === "true";
  return isCiEnv;
};

export function isTypescriptApp() {
  const entryFile = getEntryPoint(srcFolder);
  return entryFile.endsWith("ts") || entryFile.endsWith("tsx");
}

export function getConfigOrCreateIfNotExists() {
  const configFilePath = isTypescriptApp()
    ? path.resolve(currentAppDirectory, "tsconfig.json")
    : path.resolve(currentAppDirectory, "jsconfig.json");
  const hasConfig = fs.existsSync(configFilePath);

  if (!hasConfig) {
    const cfg = {
      extends: "react-monorepo-compiler/tsconfig.app.json"
    };
    fs.writeFileSync(configFilePath, JSON.stringify(cfg, null, 2));
  }

  return configFilePath;
}

export function getEntryPoint(pathToSrcFolder: string) {
  const ts = "index.ts";
  const tsx = "index.tsx";
  const js = "index.js";
  const indexTsPath = path.join(pathToSrcFolder, ts);
  const indexTsxPath = path.join(pathToSrcFolder, tsx);
  const indexJsPath = path.join(pathToSrcFolder, js);
  const indexTs = fs.existsSync(indexTsPath);
  const indexTsx = fs.existsSync(indexTsxPath);
  const indexJs = fs.existsSync(indexJsPath);

  let entryFilePath: string | null = null;

  if (indexTs) {
    entryFilePath = indexTsPath;
  }

  if (indexTsx) {
    entryFilePath = indexTsxPath;
  }

  if (indexJs) {
    entryFilePath = indexJsPath;
  }

  if (entryFilePath) {
    return entryFilePath;
  } else {
    throw new Error("No entry point found for application.");
  }
}

export function needsMonacoImports() {
  const packageJson = require(appPkgJson);
  const dependencies = Object.keys(packageJson.dependencies);

  const needsImports = dependencies.some(i => i === "monaco-editor");
  return needsImports;
}

export function getMonacoEntryPoints(
  pathToSrcFolder: string
): { [key: string]: string } {
  const needsMonaco = needsMonacoImports();

  if (!needsMonaco) return {};

  const getMonacoFolder = () => {
    return path.resolve(pathToSrcFolder, "../node_modules/monaco-editor");
  };

  return {
    "editor.worker": getMonacoFolder() + "/esm/vs/editor/editor.worker.js",
    "json.worker": getMonacoFolder() + "/esm/vs/language/json/json.worker.js",
    "css.worker": getMonacoFolder() + "/esm/vs/language/css/css.worker.js",
    "html.worker": getMonacoFolder() + "/esm/vs/language/html/html.worker.js",
    "ts.worker": getMonacoFolder() + "/esm/vs/language/typescript/ts.worker.js"
  };
}
