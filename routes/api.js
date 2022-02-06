"use strict";
var express = require('express');
var router = express.Router();
var _ = require("lodash");
var Excel = require('exceljs');
var log = require("../js/log.js");
var workbook = new Excel.Workbook();
var fs = require('fs');
var outputDir = './output';
if (!fs.existsSync(outputDir)){ fs.mkdirSync(outputDir); }

module.exports = function(Context){
    var DataManager = Context.getDataManager();
    var mailer = Context.getMailer();

    router.post("/listado", function (request, response) {
        log(request);
        var data = request.body;
        data.listado = JSON.parse(data.listado); 

        var refactoredData = _.map(data.listado, function(e){
            var unitType = "";
            if(e.personal && e.personal.tipo_documento == "LICENCIA"){
                unitType = "unidad";
            }else if(e.placa && e.placa.length > 0 && !e.personal){
                unitType = "unidad";    
            }else{
                unitType = "personal";
            }
            
            return {
                "name": (e.personal && e.personal.nombre) ? e.personal.nombre : "",
                "typeDocument": (e.personal && e.personal.tipo_documento) ? e.personal.tipo_documento : "",
                "document": (e.personal && e.personal.documento) ? e.personal.documento : "",
                "placa": e.placa ? e.placa : "",
                "remolque": e.remolque ? e.remolque : "" ,
                "observaciones": e.observaciones ? e.observaciones : "",
                "unitType": unitType
            };
        });

        buildListado(refactoredData, data.emailTo, mailer, DataManager);

        var emailTo = typeof data.emailTo == "string" ? data.emailTo : data.emailTo.join(", ");
        DataManager.logMail(1, JSON.stringify(data.listado), emailTo, function(){
            console.log("Listado guardado correctamente");
            // response.send(data);
            response.status(200).send("Correo enviado.");
        });

    });

    router.get("/personal", function (request, response) {
        log(request);
        DataManager.getPersonal( function(res){
            response.json(res.data);
        });

    });

    router.get("/vehicles", function (request, response) {
        log(request);
        DataManager.getVehicles( function(res){
            response.json(res.data);
        });

    });

    router.get("/listado", function (request, response) {
        log(request);
        DataManager.getListados( function(res){
            response.json(res.data);
        });
    });

    router.get("/destinatario", function (request, response) {
        log(request);
        DataManager.getDestinatarios( function(res){
            response.json(res.data);
        });
    });



    return router;
};














var buildListado = function(json_data, emailTo, mailer, dataManager){
    buildListadoUnidades(json_data, function(pathUnidadesFile, shouldSendUnidadesFile){
        buildListadoPersonal(json_data, function(pathPersonalFile, shouldSendPersonalFile){
            var attachments = [];
            if(shouldSendUnidadesFile){
                attachments.push({path: "./output/" + pathUnidadesFile});
            }

            if(shouldSendPersonalFile){
                attachments.push({path: "./output/" + pathPersonalFile});
            }
            mailer.sendFile(emailTo, "Listado unidades y personal - Trans. Esmeralda", attachments);
        });
    });
}


var buildListadoUnidades = function(json_data, cb){
    var NOMBRE = "B",
        DOCUMENTO = "C",
        TIPO_DOCUMENTO  = "D",
        PLACA = "E",
        REMOLQUE = "F",
        OBSERVACIONES = "G", 
        initRow = 12;

    workbook.xlsx.readFile("templates/plantilla_motoristas.xlsx")
        .then(function() { 
            var worksheet = workbook.getWorksheet(14);
            workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    
            var dataFiltered = _.filter(json_data, { "unitType": "unidad" });
            _.each(dataFiltered, function(unidad){
                worksheet.getCell(NOMBRE + initRow).value = unidad.name;
                worksheet.getCell(DOCUMENTO + initRow).value = unidad.document;
                worksheet.getCell(TIPO_DOCUMENTO + initRow).value = unidad.typeDocument;
                worksheet.getCell(PLACA + initRow).value = unidad.placa;
                worksheet.getCell(REMOLQUE + initRow).value = unidad.remolque;
                worksheet.getCell(OBSERVACIONES + initRow).value = unidad.observaciones;
                initRow += 1;
            });

            var fileName = "Listado unidades (" + buildDate() + ").xlsx";
            workbook.xlsx.writeFile(outputDir + "/" + fileName)
                .then(function() {
                    cb(fileName, dataFiltered.length > 0);
                });
        });
};

var buildListadoPersonal = function(json_data, cb){
    var NOMBRE = "B",
        DOCUMENTO = "D",
        TIPO_DOCUMENTO  = "E",
        PLACA = "F",
        OBSERVACIONES = "G", 
        initRow = 11;

    workbook.xlsx.readFile("templates/plantilla_ayudantes.xlsx")
        .then(function() { 
            var worksheet = workbook.getWorksheet(14);
            workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    
            var dataFiltered = _.filter(json_data, { "unitType": "personal" });
            _.each(dataFiltered, function(personal){
                worksheet.getCell(NOMBRE + initRow).value = personal.name;
                worksheet.getCell(DOCUMENTO + initRow).value = personal.document;
                worksheet.getCell(TIPO_DOCUMENTO + initRow).value = personal.typeDocument;
                worksheet.getCell(PLACA + initRow).value = personal.placa;
                worksheet.getCell(OBSERVACIONES + initRow).value = personal.observaciones;
                initRow += 1;
            });

            var fileName = "Listado personal (" + buildDate() + ").xlsx";
            workbook.xlsx.writeFile(outputDir + "/" + fileName)
                .then(function() {
                    cb(fileName, dataFiltered.length > 0);
                });
        });
};

var buildDate = function(){
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); 
    return hour + "h" + min + "m" + sec + "s";
};

