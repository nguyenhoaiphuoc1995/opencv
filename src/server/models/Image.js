var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var ImageSchema = new Schema({
    baseUrl: String
});

ImageSchema.post('save', (baseUrl, callback) => {
    let err = "There is no image";
    let img = new ImageSchema({
        baseUrl: baseUrl
    });
    if (!baseUrl) {
        return callback(null, err);
    }

    img.save((res) => {
        callback(res)
    });

});