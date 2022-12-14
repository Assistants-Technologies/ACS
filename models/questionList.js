const { Schema, model } = require('mongoose');

const qschema = new Schema({
    id: { type: String, required: true, unique: true },
    query: { type: String, required: true },
    answer: { type: String, required: true },
    match: { type: Number, default: 50 }
});

module.exports = model("questions", qschema);