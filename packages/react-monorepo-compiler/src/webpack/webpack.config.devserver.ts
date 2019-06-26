import { Configuration } from "webpack-dev-server";

const config: Configuration = {
  clientLogLevel: "none",
  quiet: true,
  hot: true,
  historyApiFallback: {
    disableDotRule: true
  },
  open: true,
  watchOptions: {
    poll: true
  },
  overlay: {
    warnings: true,
    errors: true
  }
};

export default config;
