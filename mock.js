"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_msw_1 = require("./src/services/api/index.msw");
var node_1 = require("msw/node");
var server = (0, node_1.setupServer)();
server.use.apply(server, (0, index_msw_1.getBookAPIMock)());
server.listen();
