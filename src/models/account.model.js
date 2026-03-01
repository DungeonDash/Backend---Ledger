import mongoose from "mongoose"


const accountSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true, "User is required"],
        index:true
    },
    status:{
        enum: ["active", "frozen", "closed"],
        message: "Status must be either active, frozen or closed"
    },
    currency:{
        type:String,
        required:[true, "Currency is required"],
        default: "INR"
    }
}, {timestamps:true})


accountSchema.index({user:1, status:1})


const accountModel = mongoose.model("account", accountSchema)

export default accountModel