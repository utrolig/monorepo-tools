"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var cwd = process.cwd();
var srcFolder = path_1.default.resolve(cwd, "src");
function getValidEntryFile() {
    var tsExtension = ".ts";
    var tsxExtension = ".tsx";
    var jsExtension = ".js";
    var jsxExtension = ".jsx";
    var indexJsFile = path_1.default.resolve(srcFolder, "index" + jsExtension);
    var indexJsxFile = path_1.default.resolve(srcFolder, "index" + jsxExtension);
    var indexTsFile = path_1.default.resolve(srcFolder, "index" + tsExtension);
    var indexTsxFile = path_1.default.resolve(srcFolder, "index" + tsxExtension);
    var indexJs = fs_1.default.existsSync(indexJsFile);
    var indexJsx = fs_1.default.existsSync(indexJsxFile);
    var indexTs = fs_1.default.existsSync(indexTsFile);
    var indexTsx = fs_1.default.existsSync(indexTsxFile);
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
exports.entryFile = getValidEntryFile();
