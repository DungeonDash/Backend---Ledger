import mongoose from "mongoose"



const transactionSchema = new mongoose.Schema({

    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a from account"],
        index:true
    },

    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with a to account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["Pending", "Completed", "Failed", "Reversed"],
            message:"Status must be either Pending, Completed, Failed or Reversed"
        },
        default:"Pending"
    },
    amount:{
        type: Number,
        required: [true, "Amount is required"],
        min: [1, "Amount must be a positive number"]
    },
    idempotencyKey:{
        type: String,
        required: [true, "Idempotency key is required"],
        index:true,
        unique: true
    }
}, {timestamps: true})



const transactionModel = mongoose.model("transaction", transactionSchema)

export default transactionModel