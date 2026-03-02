import accountModel from "../models/account.model.js"



async function createAccountController(req, res) {
    
    const user = req.user


    const account = await accountModel.create({
        user:user._id
    })

    res.status(201).json({message:"Account created successfully",status:"success", account})
}


async function getUserAccountsController(req, res){

    const accounts = await accountModel.find({user:req.user._id})

    res.status(200).json({message:"User accounts retrieved", status:"success", accounts})
}


async function getAccountBalanceController(req,res){

    const {accountId} = req.params

    const account = await accountModel.findOne({_id: accountId, user: req.user._id})

    if(!account){
        return res.status(404).json({message:"Account not found", status:"failed"})
    }

    // console.log(account)

    const balance = await account.getBalance()

    res.status(200).json({message:"Account balance retrieved", status:"success", account, balance})

}

export {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}