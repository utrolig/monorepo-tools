import fs from "fs";
import path from "path";

export const isProduction = () => {
  const isProdEnv = process.env.NODE_ENV === "production";
  return isProdEnv;
};

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
