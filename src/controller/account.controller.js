import accountModel from "../models/account.model.js"



async function createAccountController(req, res) {
    
    const user = req.user


    const account = await accountModel.create({
        user:user._id
    })

    res.status(201).json({message:"Account created successfully",status:"success", account})
}




export {
    createAccountController
}