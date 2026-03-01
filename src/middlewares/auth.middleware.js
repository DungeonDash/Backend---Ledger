import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"





async function authMiddleware(res, req, next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token){
        return res.status(401).json({message: "Unauthorized", status:"failed"})
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

export default authMiddleware


