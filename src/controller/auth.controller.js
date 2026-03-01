import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import emailService from "../services/email.service.js"


/**
* - Register Controller
* - POST /api/auth/register
*/

const registerController = async (req, res)=>{

    const {email, name, password} = req.body

    const existingUser = await userModel.findOne({email})

    if(existingUser){
        return res.status(422).json({message: "Email already exists", status:"failed"})
    }


    const newUser = await userModel.create({
        email, 
        name, 
        password
    })

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn:"3d"}) 

    res.cookie("token",token)

    res.status(201).json({message: "User registered successfully", status:"success", token, user: newUser})

    await emailService(newUser.email, newUser.name)

}


/**
* - Login Controller
* - POST /api/auth/login
*/


const loginController = async (req, res) =>{

    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(404).json({message: "User not found", status:"failed"})
    }

    const isPasswordValid = await user.comparePassword(password)

    if(!isPasswordValid){
        return res.status(401).json({message: "Invalid Credentials", status:"failed"})
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"3d"}) 

    res.cookie("token",token)

    res.status(200).json({message: "User logged in successfully", status:"success", token, user})

    
}


export {
    registerController,
    loginController
}