var mongoose = require('mongoose'),
    Group = require('./group'),
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
    group: {
        type: Number,
        default: -1
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
            // next();
        } else {                
            next(new Error('Device ' + self.alias + ' with DID ' + self.did + ' already exists.'));
        }
    });

    if (self.group == -1) {
        // Case where the device is deliberately assigned no group.
        return next();
    }

    // Otherwise, add the device to the corresponding group document
    Group.find({gid: self.group}, function (err, docs) {
        if (!docs.length) {
            next(new Error('Group with GID ' + self.group + ' does not exist.'));
        } else {
            Group.findOneAndUpdate(
                {gid: self.group},
                {$push: {dids: self.did}},
                {safe: true, upsert: true},
                function(err, group) {
                    if (err) {
                        next(new Error(err.message))
                    }
                    next();
                }
            );
        }
    });

});

module.exports = Device;