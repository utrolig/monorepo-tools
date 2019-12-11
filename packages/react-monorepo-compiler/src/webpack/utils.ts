import fs from "fs";
import path from "path";
import { srcFolder, currentAppDirectory } from "./paths";

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
