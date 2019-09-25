import { Configuration } from "webpack-dev-server";
import { publicFolder } from "./paths";

const config: Configuration = {
  clientLogLevel: "none",
  quiet: true,
  hot: true,
  historyApiFallback: {
    disableDotRule: true
  },
  contentBase: publicFolder,
  publicPath: "/",
  open: true,
  watchOptions: {
    poll: true
  }
};

export default config;
