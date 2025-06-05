const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
        enum: ["new", "good", "used", "damaged"],
    },
    pickup_location: {
        type: String,
        required: true,
    },
    availability: {
        date: {
            type: String,
            required: true,
            match: /^\d{2}\/\d{2}\/\d{4}$/,
        },
        time: {
            type: String,
            required: true,
        },
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Post", postSchema);