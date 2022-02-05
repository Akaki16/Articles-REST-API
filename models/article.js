const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define article schema
const articleSchema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    source: { type: String, required: true },
    summary: { type: String, required: true },
    link: { type: String, required: true }
});

// transform article schema
articleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

// define article model which extends article schema
const Article = mongoose.model('Article', articleSchema);

// export article model
module.exports = Article;