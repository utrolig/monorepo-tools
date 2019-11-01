#!/usr/bin/env node
import "./webpack/env";
const [_firstArg, _secondArg, task] = process.argv;

switch (task) {
  case "build":
    process.env.NODE_ENV = "production";
    const { buildApplication } = require("./build");
    buildApplication();
    break;
  case "start":
    process.env.NODE_ENV = "development";
    const { startDevServer } = require("./start");
    startDevServer();
    break;
  case "test":
    process.env.NODE_ENV = "test";
    const { runTests } = require("./test");
    runTests();
    break;
  default:
    console.log("No task specified.");
    console.log("Available tasks are");
    console.log("build - start - test");
}
