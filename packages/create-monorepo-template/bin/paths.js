"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var templateFolder = path_1.default.resolve(__dirname, "../template");
var cwd = process.cwd();
function resolveAppFolder(appName) {
    return path_1.default.resolve(process.cwd(), appName);
}
exports.resolveAppFolder = resolveAppFolder;
function appAlreadyExists(appName) {
    var exists = fs_1.default.existsSync(path_1.default.resolve(process.cwd(), appName));
    return exists;
}
exports.appAlreadyExists = appAlreadyExists;
exports.paths = {
    templateFolder: templateFolder,
    cwd: cwd
};
