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

exports.registerUser = function(nameUser, emailTo, password, url){
    var urlImage = "http://" + url + "/images/partner/"+ url + "/logo.png";
    var urlSystem = "http://" + url;

    var body =  '   <div style="width: 640px; font-family: Arial, Helvetica, sans-serif; font-size: 13px;">' +
                '        <div align="left">' +
                '           <a href="#"><img src="'+ urlImage +'" height="130"></a>' +
                '        </div>' +
                '        <h3>Estimado/a ' + nameUser + '</h3>' +
                '        <p>te damos la bienvenida a nuestra plataforma de monitoreo satelital.</p>' +
                '        <p>Puedes hacer uso de tu cuenta haciendo click en el siguiente enlace: <br></p>' +
                '            <p><a href="'+urlSystem+'">'+urlSystem+'</a> </p>' +
                '            <p>Email: <strong> ' + emailTo + ' </strong></p>' +
                '            <p>Contraseña: <strong> ' + password + ' </strong></p>' +
                '        <p>Saludos</p>' +
                '    </div>';
    var mailOptions = {
        from: 'GPS Company <alexis@tinyservice.info>',  
        to: emailTo, // puede ser una lista separada por comas
        subject: "Bienvenido " + nameUser, 
        html: body // html body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
 
