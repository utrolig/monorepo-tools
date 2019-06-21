import path from "path";
import fs from "fs";

export const currentAppDirectory = process.cwd();
export const appNodeModules = path.join(currentAppDirectory, "node_modules");
export const buildFolder = path.join(currentAppDirectory, "build");
export const srcFolder = path.join(currentAppDirectory, "src");
export const templatePath = path.join(currentAppDirectory, "public/index.html");
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
