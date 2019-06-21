import { Configuration } from "webpack-dev-server";

const config: Configuration = {
  noInfo: true,
  historyApiFallback: {
    disableDotRule: true
  },
  watchOptions: {
    poll: true
  },
  overlay: {
    warnings: true,
    errors: true
  }
};

export default config;
