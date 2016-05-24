var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Validation helper methods should return booleans
// and should be defined before the schema for readability

// Model Schema
var DeviceSchema = new Schema ({
    did : {
        type: Number
    },
    alias: {
    	type: String
    },
    description: {
    	type: String
    },
    lastOnline: {
    	type: Date
    }
});

module.exports = mongoose.model('Device', DeviceSchema);