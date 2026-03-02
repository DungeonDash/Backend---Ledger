import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import tokenBlacklistModel from "../models/blacklist.model.js"




async function authMiddleware(req, res, next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    // console.log(token)

    if (!token){
        return res.status(401).json({message: "Unauthorized", status:"failed"})
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({message: "User token is blacklisted. Please login again."})
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await userModel.findById(decoded.userId) 

        req.user = user
        
        return next()
    }
    catch(error){
        console.log("Unauthorized access attempt", error)
    }
}


async function authSystemUserMiddleware(req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token){
        return res.status(401).json({message: "Unauthorized", status:"failed"})
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({message: "User token is blacklisted. Please login again."})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await userModel.findById(decoded.userId).select("+systemUser")

        if(!user.systemUser){
            res.status(403).json({message:"Forbidden: Access is denied", status:"failed "})
        }

        req.user = user
        
        return next()
    }
    catch(error){
        console.log("Unauthorized access attempt", error)
    }


}


export {
    authMiddleware,
    authSystemUserMiddleware
}


