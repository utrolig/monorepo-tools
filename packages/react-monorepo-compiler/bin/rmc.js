#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var start_1 = require("./start");
var build_1 = require("./build");
var test_1 = require("./test");
var _a = process.argv, _firstArg = _a[0], _secondArg = _a[1], task = _a[2];
switch (task) {
    case "build":
        build_1.buildApplication();
        break;
    case "start":
        start_1.startDevServer();
        break;
    case "test":
        test_1.runTests();
        break;
    default:
        console.log("No task specified.");
        console.log("Available tasks are");
        console.log("build - start - test");
}
