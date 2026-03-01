import mongoose from "mongoose"


const connectDB = () => {

     mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to MongoDB")
     }).catch((err)=>{
        console.log("Error connecting to MongoDB", err)
        process.exit(1)
     })

}


export default connectDB