import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema({
    time : {
        type : Date,
        requried : true
    }
}, {timestamps : true});

const statisticsModel = mongoose.model("Statistic", statisticsSchema);

export default statisticsModel;