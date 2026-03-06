import mongoose from "mongoose";
import constants from "../constants.js";



const mongooseConnection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${constants.DB_NAME}`)
       console.log("Connected To MongoDB 🟢");
       
      } catch (err) {
        console.log("Error in connecting to MongoDB 🔴", err);
        process.exit(1);
      }
 }

 export default mongooseConnection;