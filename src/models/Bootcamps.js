const mongoose = require('mongoose');
const slugify = require('slugify');

const { Schema, model } = mongoose;
const { String, Boolean, Date } = mongoose.Schema.Types;
const BootcampSchema = new Schema({
   name: {
       type: String,
       required: [true, 'Please, add a name'],
       trim: true,
       unique: true,
       maxlength: [40, 'The name cannot be more then 40 chars!'],
       minlength: [3, 'The name cannot be less than 3 chars!']
   },
    slug: String,
    description: {
        type: String,
        required: [true, 'The description cannot be empty!'],
        trim: true,
        maxlength: [300, 'The description cannot be more than 300 chars']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please, enter valid URL'
        ]
    },
    phone: {
       type: String,
        maxlength: [50, 'The phone number cannot be longer than 50 chars']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    location: {
        // Using "GeoJSON" Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            "Web Development",
            "UI/UX",
            "Mobile Development",
            "Business",
            "Data Science",
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true}
});

// Creating reverse populate field (virtual field)
// @see: https://mongoosejs.com/docs/populate.html#populate-virtuals
BootcampSchema.virtual('courses', {
    ref: 'courses',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
})

// Creating slug from the name
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true,
        replacement: '-'
    })
    next();
});

// Cascade delete the all courses when we remove bootcamp
BootcampSchema.pre('remove', async function (next) {
    await this.model('courses').deleteMany({
        bootcamp: this._id
    })
    next();
})
module.exports = model('bootcamps', BootcampSchema);
