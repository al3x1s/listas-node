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

var fs = require("fs");
var xml2js = require("xml2js");
var _ = require("lodash"); 
var parser = new xml2js.Parser();
var configFile = "config.xml";

// Constructor
var Context = function(app, session, cb){
	this.app = app;
	this.session = session;
	this.init(cb);
};

Context.prototype = {
	getConfig: function(){
		return this.config;
	},

	getMailer: function(){
		return this.mailer;
	},

	loadConfig: function(cb){
		fs.readFile(configFile, function(err, data) {
		    parser.parseString(data, function (err, result) {
		        var entry = result.properties.entry;
		        var config =  _.chain(entry).map(e => ([e.$.key, e["_"].replace(/\s+/g, " ")])).fromPairs().value();
		        cb(config); 
		    });
		});
	},

	getDataManager: function(){
		return this.dataManager;
	},

	initApp: function(){
		var port = this.config["web.port"] || 3000;
		this.app.listen(port, function () {
	        console.log("\nEsmeralda System Started");
	        console.log("    Web API listening at PORT -> " + port);
	    });
	},

	init: function(cb){
		this.loadConfig(function(config){
			this.config = config;
			this.dataManager = require("../database/DataManager.js")(config);
			this.mailer = require("./mailer.js")(config);
			this.initApp();
			cb();
		}.bind(this));
	},
};

module.exports = Context;