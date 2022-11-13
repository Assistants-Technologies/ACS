const { Schema, model } = require('mongoose');

const qschema = new Schema({
    search: { type: String, default: 'search' },
	list: { type: Array, default: [] }
});

module.exports = model("questions", qschema);