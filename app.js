/*
 * Copyright 2016 Irving Gonzalez (ialexis93@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var app = express();
var session = require("express-session")({ 
    cookieName: "session",
    secret: "egkfnvkjksjnlhxbaksjb{};;8", 
    resave: false, 
    saveUninitialized: true
});

var Context = require("./js/Context.js");
Context = new Context(app, session, () => initApp(Context));

var initApp = function(Context){
    var api = require("./routes/api.js")(Context);

    app.use(express.static(__dirname + "/views/web"));
    app.engine("html", require("ejs").renderFile);
    app.use(session);

    app.use(bodyParser.json({keepExtensions: true}));
    app.use(bodyParser.urlencoded({extended: true}));

    // Add headers
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", "*");
        // Request methods you wish to allow
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        // Request headers you wish to allow
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", true); 
        // Pass to next layer of middleware
        next();
    });

    app.use("/api", api);

};
