import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    slot_no: {
        type: Number,
        required: true
    },
    vehicle: {
        type: String,
        required: true
    },
    booked: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const slotModel = mongoose.model("Slot", slotSchema);

export default slotModel;