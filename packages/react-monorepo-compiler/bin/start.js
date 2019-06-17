"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_config_1 = __importDefault(require("./webpack/webpack.config"));
function startDevServer() {
    var port = 4567;
    var devServerOptions = {
        open: true
    };
    console.log("Startin dev server.");
    var compiler = webpack_1.default(webpack_config_1.default);
    var devServer = new webpack_dev_server_1.default(compiler, devServerOptions);
    devServer.listen(port, function () {
        console.log("Listening at:", port);
    });
}
exports.startDevServer = startDevServer;
