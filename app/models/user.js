var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Validation helper methods should return booleans
// and should be defined before the schema for readability

// Model Schema
var UserSchema = new Schema ({
    username: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema);