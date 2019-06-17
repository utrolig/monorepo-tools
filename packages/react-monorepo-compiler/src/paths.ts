import path from "path";
import fs from "fs";

const cwd = process.cwd();
const srcFolder = path.resolve(cwd, "src");

function getValidEntryFile() {
  const tsExtension = ".ts";
  const tsxExtension = ".tsx";
  const jsExtension = ".js";
  const jsxExtension = ".jsx";

  const indexJsFile = path.resolve(srcFolder, "index" + jsExtension);
  const indexJsxFile = path.resolve(srcFolder, "index" + jsxExtension);
  const indexTsFile = path.resolve(srcFolder, "index" + tsExtension);
  const indexTsxFile = path.resolve(srcFolder, "index" + tsxExtension);

  const indexJs = fs.existsSync(indexJsFile);
  const indexJsx = fs.existsSync(indexJsxFile);
  const indexTs = fs.existsSync(indexTsFile);
  const indexTsx = fs.existsSync(indexTsxFile);

  if (indexJs) {
    return indexJsFile;
  }

  if (indexJsx) {
    return indexJsxFile;
  }

  if (indexTs) {
    return indexTsFile;
  }

  if (indexTsx) {
    return indexTsxFile;
  }
}

export const entryFile = getValidEntryFile();
