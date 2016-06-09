var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    // autoIncrement = require('mongoose-auto-increment');


/* connect to your database here */

/* define your CounterSchema here */

// autoIncrement.initialize(mongoose.connection);
// CounterSchema.plugin(autoIncrement.plugin, 'Counter');
// var Counter = mongoose.model('Counter', CounterSchema);

// Group Schema
/*var DeviceSchema = new Schema ({
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
    },

    varUpdates: [{
        handle : String,
        value : String,
        timestamp : Date
    }],

    logs: [{
            critical: Number, 
            log: String,
            timestamp: Date
    }]
});

var Device = mongoose.model('Device', DeviceSchema);

DeviceSchema.pre('save', function (next) {
    var self = this;
   
    Device.find({did : self.did}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error('Device ' + self.alias + ' with DID ' + self.did + ' already exists.'));
        }
    });    
});
*/
// module.exports = Device;