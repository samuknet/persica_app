var mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Validation helper methods should return booleans
// and should be defined before the schema for readability

// Model Schema
var DeviceSchema = new Schema ({
    did: {
        type: Number,
        unique: true,
        required: true,
        dropDups: true
    },

    alias: {
    	type: String,
        required: true
    },
    
    description: {
    	type: String
    },
    
    lastOnline: {
    	type: Date
    }
});

// DeviceSchema.pre('save', function (next) {
//     var self = this;
//     var DeviceModel = mongoose.model('DeviceModel', DeviceSchema);
//     DeviceModel.find({did : self.did}, function (err, docs) {
//         if (!docs.length){
//             next();
//         }else{                
//             console.log('Device ' + self.did + ' exists with alias ' + self.alias + '.');
//             next(new Error("Duplicate Device!"));
//         }
//     });
// });

module.exports = mongoose.model('Device', DeviceSchema);