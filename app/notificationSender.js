var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "io.persica@gmail.com",
       pass: "persica2016"
   }
});

var exports = {}

exports.sendEmail = function(email, logObj) {
	var mailOptions = {
   		from: '"Persica 👥" <notifications@persica.io>',
   		to: email,
   		subject: "Critical Level " +  logObj.critical + " reached on device " + logObj.did,
    	text: logObj.log
    };

    smtpTransport.sendMail(mailOptions, function(error, info) {
    if(error){
       console.log(error);
    }else{
       console.log("Message sent: " + info.message);
    }
   
    smtpTransport.close();
});

};

exports.sendSMS = function(phoneNumber, logObj) {
  console.log('Sending a text message to', phoneNumber, 'containing the info', logObj);
};

module.exports = exports 


