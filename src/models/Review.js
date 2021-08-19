const mongoose = require('mongoose');
const colors = require("colors");

const { Schema, model } = mongoose;
const { String, Date, ObjectId, Number } = mongoose.Schema.Types;
const ReviewSchema = new Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Error! Please, Add a title!'],
        maxlength: [100, 'Error! The max chars must be 100']
    },
    text: {
        type: String,
        required: [true, 'Error! Add a description!']
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
        required: [true, 'Error! Add a rating between 1 - 10!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: ObjectId,
        ref: 'bootcamps',
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'users',
        required: true
    }
});

// Prevent the user to send more review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Generated average rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId)  {
    const averageRating = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: { _id: '$bootcamp', averageRating: { $avg: '$rating' } } }
    ]);

    try {
        await this.model('bootcamps').findByIdAndUpdate(bootcampId, {
            averageRating: Math.ceil(averageRating[0].averageRating / 10) * 10
        })
    } catch (reason) {
        console.log(colors.red('Error! Something is wrong with updating of the average rating on the review'))
    }
}

ReviewSchema.pre('save', function () {
    this.constructor.getAverageRating(this.bootcamp)
})

ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp)
})
module.exports = model('reviews', ReviewSchema);
