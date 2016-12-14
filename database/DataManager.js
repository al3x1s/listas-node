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
var _ = require("lodash");

module.exports = function(config){
    var sqlQuery = 0; 

    var dataManager = {};

    var mysql = require('mysql');
    var pool = mysql.createPool({
        acquireTimeout: 15000,
        connectionLimit: 30,
        host: config["database.url"],
        port: 3306,
        user: config["database.user"],
        password: config["database.password"],
        database: config["database.dbname"],
        //socketPath: "/var/run/mysqld/mysqld.sock",
        multipleStatements: true
    });

    pool.getConnection(function (err, connection) {
        console.log(err || "    Database ok. [host: " + config["database.url"] + "]");
    });

    pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
    });

    /**
    * Functions
    */

    function queryExec(query, params, cb){
        pool.getConnection(function (err, connection) {
            connection.query(query, params, function (err, rows, fields) {
                if (err) console.log("Error Selecting : %s ", err);
                connection.release();
                // Don't use the connection here, it has been returned to the pool.
                var error = (err) ? true : false;
                if(cb){
                    cb({ error: error, data: rows, msg: err});    
                }
            });
        });
    }

    function insertExec(query, params, cb){
        pool.getConnection(function (err, connection) {
            connection.query(query, params, function (err, res, fields) {
                if (err) console.log("Error inserting : %s ", err);
                connection.release();
                // Don't use the connection here, it has been returned to the pool.
                var error = (err) ? true : false;
                if(cb){
                    cb({error: false, insertId: res.insertId});
                }
            });
        });
    }

    function updateExec(query, params, cb){
        pool.getConnection(function (err, connection) {
            connection.query(query, params, function (err, res, fields) {
                if (err) console.log("Error Updating : %s ", err);
                connection.release();
                // Don't use the connection here, it has been returned to the pool.
                var error = (err) ? true : false;
                if(cb){
                    cb({error: false, changedRows: res.changedRows});
                }
            });
        });
    }

    // =======================================================================================
    // ==============================    API    ==============================================
    // =======================================================================================

    dataManager.getPersonal = function (cb) {
        queryExec(config["database.selectPersonal"], [], cb);
    };

    dataManager.getVehicles = function (cb) {
        queryExec(config["database.selectVehicles"], [], cb);
    };

    dataManager.logMail = function(almacenadoraId, raw, emailsTo, cb){
        queryExec(config["database.insertLogMail"], [almacenadoraId, raw, emailsTo], cb);   
    }

    dataManager.getListados = function(cb){
        queryExec(config["database.getListados"], [], cb);   
    }

    dataManager.getDestinatarios = function(cb){
        queryExec(config["database.getDestinatarios"], [], cb);   
    }

    return dataManager;
};