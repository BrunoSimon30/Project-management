import "./config/loadenv.js";
import { app } from "./app.js";
import constants from "./constants.js";
import mongooseConnection from "./db/mongoose.connection.js";


 
mongooseConnection()
.then(()=>{
    app.listen(constants.PORT, () => {
        console.log(`Server is running on port ${constants.PORT} 🟢`);
      });
})
.catch((err)=>{
    console.log("Error in connecting to MongoDB 🔴", err);
    process.exit(1);
})