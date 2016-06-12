var nodemailer = require('nodemailer');
var twilio = require('twilio');
var _ = require('underscore');

var User = require('./models/user'),
    Notification = require('./models/notification');

module.exports = function(control) {
    
    var sendPopupTo = function(type, did, message, username) {
        var notification = {type: type, did: did, message: message, username: username};
        new Notification(notification).save(function (err, model) {
            if (err) {
                console.log(err);
            }
            control.emit('notification-new', model);
        });
        console.log('sending popup');
    };

    var sendPopupToAllUsers = function (type, did, message) {
        User.find({}, function (err, users) {
            _.forEach(users, function (user) {
                sendPopupTo(type, did, message, user.username);
            });
        });
    }


    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",  // sets automatically host, port and connection security settings
        auth: {
           user: "io.persica@gmail.com",
           pass: "persica2016"
       }
   });


    var sendEmail = function(email, logObj) {
        var mailOptions = {
         from: '"Persica 👥" <notifications@persica.io>',
         to: email,
         subject: "Critical Level " +  logObj.critical + " reached on device " + logObj.did,
         text: logObj.log
     };

     smtpTransport.sendMail(mailOptions, function(error, info) {
        if(error){
           console.log(error);
       } else {
           console.log("Message sent: " + info.message);
       }

       smtpTransport.close();
   });

 };

 var sendSMS = function(phoneNumber, logObj) {
    var client = new twilio.RestClient('AC1d25d1a714a4c14adef5b8100d961694', 'dd128390134269f2f285d17a671545a8');

    client.sms.messages.create({
     to: phoneNumber,
     from:'+441234480129',
     body: "Persica.io \nCritical Level " + logObj.critical + " detected on device " + logObj.did + ". \nLog: " + logObj.log
 }, function(error, message) {
     if (!error) {
         console.log('Success! The SID for this SMS message is:');
         console.log(message.sid);

         console.log('Message sent on:');
         console.log(message.dateCreated);
     } else {
      console.log(error);
      console.log('Oops! There was an error.');
  }
});

};

return {
    sendPopupTo: sendPopupTo,
    sendPopupToAllUsers: sendPopupToAllUsers,
    sendEmail: sendEmail,
    sendSMS: sendSMS
};
}
