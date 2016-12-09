"use strict";
var express = require('express');
var router = express.Router();
var mailer = require("../js/mailer.js");
var _ = require("lodash");
var Excel = require('exceljs');
var workbook = new Excel.Workbook();

module.exports = function(Context){
    var DataManager = Context.getDataManager();

    router.post("/listado", function (request, response) {
        // log(request);
        var data = request.body;
        var refactoredData = _.map(data, function(e){
            return {
                "name": e.personal.nombre,
                "typeDocument": e.personal.tipo_documento,
                "document": e.personal.documento,
                "placa": e.placa,
                "remolque": e.remolque,
                "observaciones": e.observaciones,
                "unitType": e.personal.tipo_documento == "LICENCIA" ? "unidad" : "personal"
            };
        });

        buildListadoUnidades(refactoredData);
        buildListadoPersonal(refactoredData);
        response.sendStatus(200);
    });


    router.get("/personal", function (request, response) {
        // log(request);
        DataManager.getPersonal( function(res){
            response.json(res.data);
        });

    });


    router.get("/vehicles", function (request, response) {
        // log(request);
        DataManager.getVehicles( function(res){
            response.json(res.data);
        });

    });

    return router;
};



var buildListadoUnidades = function(json_data){
    var NOMBRE = "B",
        DOCUMENTO = "C",
        TIPO_DOCUMENTO  = "D",
        PLACA = "E",
        REMOLQUE = "F",
        OBSERVACIONES = "G", 
        initRow = 11;

    workbook.xlsx.readFile("templates/plantilla_motoristas.xlsx")
        .then(function() { 
            var worksheet = workbook.getWorksheet(14);
            workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    

            _(json_data)
                .filter({ "unitType": "unidad" })
                .each(function(unidad){
                    worksheet.getCell(NOMBRE + initRow).value = unidad.name;
                    worksheet.getCell(DOCUMENTO + initRow).value = unidad.document;
                    worksheet.getCell(TIPO_DOCUMENTO + initRow).value = unidad.typeDocument;
                    worksheet.getCell(PLACA + initRow).value = unidad.placa;
                    worksheet.getCell(REMOLQUE + initRow).value = unidad.remolque;
                    worksheet.getCell(OBSERVACIONES + initRow).value = unidad.observaciones;
                    initRow += 1;
                });

            var fileName = "Listado motoristas (" + buildDate() + ").xlsx";
            workbook.xlsx.writeFile("output/" + fileName)
                .then(function() {
                    console.log("file saved properly");
                    mailer.sendFile("ialexis93@gmail.com", "output/" + fileName);
                });
        });
};

var buildListadoPersonal = function(json_data){
    var NOMBRE = "B",
        DOCUMENTO = "D",
        TIPO_DOCUMENTO  = "E",
        PLACA = "F",
        OBSERVACIONES = "G", 
        initRow = 12;

    workbook.xlsx.readFile("templates/plantilla_ayudantes.xlsx")
        .then(function() { 
            var worksheet = workbook.getWorksheet(14);
            workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    

            _(json_data)
                .filter({ "unitType": "personal" })
                .each(function(personal){
                    worksheet.getCell(NOMBRE + initRow).value = personal.name;
                    worksheet.getCell(DOCUMENTO + initRow).value = personal.document;
                    worksheet.getCell(TIPO_DOCUMENTO + initRow).value = personal.typeDocument;
                    worksheet.getCell(PLACA + initRow).value = personal.placa;
                    worksheet.getCell(OBSERVACIONES + initRow).value = personal.observaciones;
                    initRow += 1;
                });

            workbook.xlsx.writeFile("output/Listado ayudantes (" + buildDate() + ").xlsx")
                .then(function() {
                    console.log("file saved properly");
                });
        });
};

var buildDate = function(){
    var date = new Date();
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
};
