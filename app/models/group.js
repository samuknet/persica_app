var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

// Group Schema
var GroupSchema = new Schema ({
    gid: {
        type: Number,
        unique: true,
        required: true,
        dropDups: true
    },
    name: {
    	type: String,
        required: true
    },
    description: {
    	type: String
    },
    dids: [Number]
});

GroupSchema.plugin(autoIncrement.plugin, { model: 'Group', field: 'gid' });
var Group = mongoose.model('Group', GroupSchema);
module.exports = Group;