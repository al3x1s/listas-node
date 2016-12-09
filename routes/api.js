"use strict";
var express = require('express');
var router = express.Router();
var mailer = require("../js/mailer.js");
var _ = require("lodash");

module.exports = function(Context){
    var DataManager = Context.getDataManager();
    
    router.post("/lista", function (request, response) {
        // log(request);
        var data = request.body;
        console.log(data);
        // DataManager.saveCompany(partnerid, data, (res) =>  response.json(res));    

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






// var _ = require("lodash");
// var Excel = require('exceljs');
// var workbook = new Excel.Workbook();

// var overkill = [
//     {
//         "name": "Pablo Valiente Hernandez",
//         "typeDocument": "LICENCIA",
//         "document": "0315-010993-101-3",
//         "placa": "C-92614",
//         "remolque": "RE-9389",
//         "observaciones": "RESERVA",
//         "unitType": "unidad"
//     },
//     {
//         "name": "Saul Alberto Aguilar malia",
//         "typeDocument": "DUI",
//         "document": "04899921-9",
//         "placa": "C-92614",
//         "observaciones": "",
//         "unitType": "personal"
//     }
// ];

// var buildListadoUnidades = function(json_data){
//     var NOMBRE = "B",
//         DOCUMENTO = "C",
//         TIPO_DOCUMENTO  = "D",
//         PLACA = "E",
//         REMOLQUE = "F",
//         OBSERVACIONES = "G", 
//         initRow = 11;

//     workbook.xlsx.readFile("plantilla_motoristas.xlsx")
//         .then(function() { 
//             var worksheet = workbook.getWorksheet(14);
//             workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    

//             _(json_data)
//                 .filter({ "unitType": "unidad" })
//                 .each(function(unidad){
//                     worksheet.getCell(NOMBRE + initRow).value = unidad.name;
//                     worksheet.getCell(DOCUMENTO + initRow).value = unidad.document;
//                     worksheet.getCell(TIPO_DOCUMENTO + initRow).value = unidad.typeDocument;
//                     worksheet.getCell(PLACA + initRow).value = unidad.placa;
//                     worksheet.getCell(REMOLQUE + initRow).value = unidad.remolque;
//                     worksheet.getCell(OBSERVACIONES + initRow).value = unidad.observaciones;
//                     initRow += 1;
//                 });

//             workbook.xlsx.writeFile("Listado motoristas (" + buildDate() + ").xlsx")
//                 .then(function() {
//                     console.log("file saved properly");
//                 });
//         });
// };

// var buildListadoPersonal = function(json_data){
//     var NOMBRE = "B",
//         DOCUMENTO = "D",
//         TIPO_DOCUMENTO  = "E",
//         PLACA = "F",
//         OBSERVACIONES = "G", 
//         initRow = 12;

//     workbook.xlsx.readFile("plantilla_ayudantes.xlsx")
//         .then(function() { 
//             var worksheet = workbook.getWorksheet(14);
//             workbook.views = [{ x: 0, y: 0, width: 25000, height: 18000, firstSheet: 1, activeTab: 1, visibility: 'visible'}];    

//             _(json_data)
//                 .filter({ "unitType": "personal" })
//                 .each(function(personal){
//                     worksheet.getCell(NOMBRE + initRow).value = personal.name;
//                     worksheet.getCell(DOCUMENTO + initRow).value = personal.document;
//                     worksheet.getCell(TIPO_DOCUMENTO + initRow).value = personal.typeDocument;
//                     worksheet.getCell(PLACA + initRow).value = personal.placa;
//                     worksheet.getCell(OBSERVACIONES + initRow).value = personal.observaciones;
//                     initRow += 1;
//                 });

//             workbook.xlsx.writeFile("Listado ayudantes (" + buildDate() + ").xlsx")
//                 .then(function() {
//                     console.log("file saved properly");
//                 });
//         });
// };

// var buildDate = function(){
//     var date = new Date();
//     var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
//     var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
//     var year = date.getFullYear();
//     return day + '-' + month + '-' + year;
// };

// buildListadoUnidades(overkill);
// buildListadoPersonal(overkill);