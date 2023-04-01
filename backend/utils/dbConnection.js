import mongoose from "mongoose";

const connection = () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log("db connected successfully");
        })
        .catch(err => err);
}

export default connection;