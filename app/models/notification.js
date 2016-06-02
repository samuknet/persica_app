var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Validation helper methods should return booleans
// and should be defined before the schema for readability

// Model Schema
var NotificationSchema = new Schema ({
    username: {
        type: String,    
    },
    type: {
        type: String
    },
    did : {
        type: Number
    },
    message: {
        type: String
    },
    timestamp: {
    	type: Date
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);
