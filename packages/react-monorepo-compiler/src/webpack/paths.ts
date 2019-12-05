import path from "path";
import fs from "fs";

export const currentAppDirectory = process.cwd();
export const appNodeModules = path.join(currentAppDirectory, "node_modules");
export const buildFolder = path.join(currentAppDirectory, "build");
export const srcFolder = path.join(currentAppDirectory, "src");
export const publicFolder = path.join(currentAppDirectory, "public");
export const templatePath = path.join(publicFolder, "index.html");
export const tsConfig = path.join(currentAppDirectory, "tsconfig.json");
export const jsConfig = path.join(currentAppDirectory, "jsconfig.json");
export const tsLintConfig = path.join(currentAppDirectory, "tslint.json");
export const isMonorepo = fs.existsSync(
  path.join(currentAppDirectory, "../../packages")
);

export const reactBuildArtifactsFolderName = "assets";
export const reactBuildArtifactsNameTemplateString = `${reactBuildArtifactsFolderName}/[name].[contenthash:8]`;
export const monorepoRootDir = path.join(currentAppDirectory, "../../");

export const eslintPluginResolutionPath = __dirname;

export const getAppEntryFile = (srcPath: string) => {
  const tsxPath = path.join(srcPath, "index.tsx");
  const tsPath = path.join(srcPath, "index.ts");
  const jsPath = path.join(srcPath, "index.js");
  const isTsx = fs.existsSync(tsxPath);
  const isTs = fs.existsSync(tsPath);
  const isJs = fs.existsSync(jsPath);
  if (isTsx) return tsxPath;
  if (isTs) return tsPath;
  if (isJs) return jsPath;
  throw new Error("No app entry file found.");
};
export const getAliasPaths = () => {
  const packagesFolder = path.join(currentAppDirectory, "../");
  const folders = fs.readdirSync(packagesFolder);
  const aliases = folders.reduce((acc, folderName) => {
    return {
      ...acc,
      [folderName]: path.resolve(packagesFolder, folderName)
    };
  }, {});
  return aliases;
};
