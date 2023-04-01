import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    slot_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    type : {
        type : String,
        required : true
    },
    slot_no : {
        type : Number,
        required : true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    expireAt : {
        type : Date,
        default : '24h',
    }
}, { timestamps: true });

const bookingModel = mongoose.model("Booking", bookingSchema);

export default bookingModel;