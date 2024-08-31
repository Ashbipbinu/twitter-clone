import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to the database");
    } catch (error) {
        console.log(`Error while connecting to Database ${error.message}`);
        process.exit(1)
    }

}

export default connectMongoDB 