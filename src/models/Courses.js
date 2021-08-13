const mongoose = require('mongoose');
const colors = require('colors');

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

// Generated average const for particular bootcamp
CoursesSchema.statics.getAverageCost = async function (bootcampId)  {
    const averageCost = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        { $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } } }

    ]);

    try {
        await this.model('bootcamps').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(averageCost[0].averageCost / 10) * 10
        })
    } catch (reason) {
        console.log(colors.red('Error! Something is wrong with updating of the average cost on the bootcamp'))
    }
}


// Update the average cost after save
CoursesSchema.post('save', function (next) {
    this.constructor.getAverageCost(this.bootcamp)
});

// Update the average cost before remove
CoursesSchema.pre('remove', function (next) {
    this.constructor.getAverageCost(this.bootcamp)
});

module.exports = model('courses', CoursesSchema);
