var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var CommentSchema = new Schema ({
    author: String,
    message: String,
    timestamp: Date
})

// Model Schema
var TicketSchema = new Schema ({
    tid: Number,
    did: Number,
    title: String,
    description: String,
    issuedBy: String,
    timestamp: Date,
    comments: [CommentSchema]
});

TicketSchema.plugin(autoIncrement.plugin, { model: 'Ticket', field: 'tid' });
module.exports = mongoose.model('Ticket', TicketSchema);
