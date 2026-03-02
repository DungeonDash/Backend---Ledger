import mongoose from "mongoose"
import txnModel from "../models/transaction.model.js"
import ledgerModel from "../models/ledger.model.js"
import accountModel from "../models/account.model.js"
import {sendTransactionEmail} from "../services/email.service.js"





async function createTransactionController(req, res) {


// Taking input
    const {amount, idempotencyKey, fromAccount, toAccount} = req.body

    if (!amount || !idempotencyKey || !fromAccount || !toAccount){
        return res.status(400).json({message:"All details are required", status:"failed"})
    }


// Fetch accounts
    const fromAcc = await accountModel.findById({_id:fromAccount})
    const toAcc = await accountModel.findById({_id:toAccount})

    if (!fromAcc || !toAcc){
        return res.status(400).json({message:"Invalid From or To Account", status:"Failed"})
    }


// Validating idempotency key
    const txnExists = await txnModel.findOne({idempotencyKey})

    if (txnExists){
        if (txnExists.status === "Completed"){
            return res.status(200).json({message:"Transaction already completed", status:"success", txnExists})
        }
        
        if (txnExists.status === "Pending"){
            return res.status(200).json({message:"Transaction is still pending", status:"pending"})
        }
        
        if (txnExists.status === "Failed"){
            return res.status(500).json({message:"Transaction has failed, Please retry!!!", status:"failed"})
        }

        if (txnExists.status === "Reversed"){
            return res.status(500).json({message:"Transaction was reversed, Please retry!!!", status:"failed"})
        }
    }


// Account Status Check
    if (fromAcc.status !== "Active" || toAcc.status !== "Active"){
        return res.status(400).json({message:"Both accounts must be active to perform transactions", status:"failed"})
    }


// Getting the balance of user account using Aggregation Pipeline

    const balance = await fromAcc.getBalance()

    if (balance < amount){
        return res.status(400).json({message:`Insufficient balance. Your current balance is ${balance} and Requested amount is ${amount}`, status:"failed"})
    }



// Create Transaction
    const session = await mongoose.startSession()
    session.startTransaction()


    const transaction = new txnModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"Pending"
    })


    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAcc,
        type: "Debit",
        amount,
        transaction: transaction._id
    }], {session})


    const creditLedgerEntry = await ledgerModel.create([{
        account: toAcc,
        type: "Credit",
        amount,
        transaction: transaction._id
    }], {session})


    transaction.status = "Completed"
    await transaction.save({session})


    await session.commitTransaction()
    session.endSession()


// Send Email Notification (Mock)

    await sendTransactionEmail(req.user.email, req.user.name, amount, toAcc._id)

    res.status(201).json({message:"Transaction completed successfully", status:"success", transaction})

}


async function createInitialFundsController(req,res){

    const {toAccount, amount, idempotencyKey} = req.body

    if (!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message:"All details are required", status:"failed"})
    }

    // console.log("Searching for account with ID:", toAccount)
    const toUserAcc = await accountModel.findOne({_id: toAccount})
    // console.log("Found account:", toUserAcc)

    if(!toUserAcc){
        return res.status(400).json({message:"Invalid to-Account", status:"failed"})
    }

    const fromSystemAcc = await accountModel.findOne({ user: req.user._id})

    if(!fromSystemAcc){
        return res.status(400).json({message:"System account not found for the user", status:"failed"})
    }


    const session = await mongoose.startSession()
    session.startTransaction()


    const transaction = new txnModel({
        fromAccount: fromSystemAcc._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"Pending"
    })

    // console.log(transaction)

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromSystemAcc._id,
        amount: amount,
        transaction: transaction._id,
        type: "Debit"
    }], {session})


    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "Credit"
    }], {session})


    transaction.status = "Completed"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({message:"Initial Funds transaction completed successfully", status:"success", transaction})


}


export {
    createTransactionController,
    createInitialFundsController
}