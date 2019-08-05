"use strict";

var express = require('express');

var expressGraphQL = require('express-graphql');

var schema = require('./schema/schema');

var app = express();
app.use('/graphql', expressGraphQL({
  // graphiql is a dev tool to make queries against the dev server. only use in a dev environment. 
  // schema, // es6 shortcut, key & value share the same name
  schema: schema,
  graphiql: true
}));
var port = 4000;
app.listen(port, function () {
  console.log("app running on port ".concat(port));
});