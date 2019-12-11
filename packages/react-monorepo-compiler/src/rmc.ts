#!/usr/bin/env node
const [_firstArg, _secondArg, task] = process.argv;

switch (task) {
  case "build":
    process.env.NODE_ENV = "production";
    require("./webpack/env");
    const { buildApplication } = require("./build");
    buildApplication();
    break;
  case "start":
    process.env.NODE_ENV = "development";
    require("./webpack/env");
    const { startDevServer } = require("./start");
    startDevServer();
    break;
  case "test":
    process.env.NODE_ENV = "test";
    require("./webpack/env");
    const { runTests } = require("./test");
    runTests();
    break;
  default:
    console.log("No task specified.");
    console.log("Available tasks are");
    console.log("build - start - test");
}
