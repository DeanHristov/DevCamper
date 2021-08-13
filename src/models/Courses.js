const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const { String, Boolean, Date, ObjectId } = mongoose.Schema.Types;
const CoursesSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Error! Add a course title!']
    },
    description: {
        type: String,
        required: [true, 'Error! Add a description!']
    },
    weeks: {
        type: String,
        required: [true, 'Error! Add number of weeks!']
    },
    tuition: {
        type: Number,
        required: [true, 'Error! Add a tuition cost!']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Error! Add a minimum skill!'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
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

module.exports = model('courses', CoursesSchema);
