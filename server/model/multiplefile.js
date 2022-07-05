const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const multipleFileSchema = new Schema ({
    user: {
        type: String,
        required: true
    },
    files: [Object]
}, {timestamps: true});

module.exports= mongoose.model('MultipleFile', multipleFileSchema);