// http://nodemailer.com
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user: 'alexis@tinyservice.info',
        pass: 'spl1nterce!!'
    }
});


exports.sendFile = function(emailTo, path){
    var body =  '   <div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">' +
                '        <h3>Transportes Esmeralda</h3>' +
                '        <p>Listado solicitado</p>' +
                '        <p>Saludos</p>' +
                '    </div>';
    
    var mailOptions = {
        from: 'Transportes Esmeralda <alexis@tinyservice.info>',  
        to: emailTo, // puede ser una lista separada por comas
        subject: "Listado solicitado", 
        html: body,
        attachments: [{  
            path: path
        }]
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
 
