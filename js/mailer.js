// http://nodemailer.com
var nodemailer = require('nodemailer');

module.exports = function(config){
    var transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: config["mail.user"],
            pass: config["mail.password"]
        }
    });

    return {
        sendFile: function(emailTo, subject, attachments){
            var body =  '   <div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">' +
                        '        <h1>TRANSPORTES ESMERALDA</h1>' +
                        '        <p>Listado solicitado</p>' +
                        '    </div>';
            
            var mailOptions = {
                from: 'Transportes Esmeralda <transporte.esmeralda@hotmail.com>',  
                to: emailTo, // puede ser una lista separada por comas
                subject: subject, 
                html: body,
                attachments: attachments
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){ return console.log(error);}
                console.log('Message sent: ' + info.response);
            });
        }

    };
};
