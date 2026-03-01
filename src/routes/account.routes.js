import express from "express"
import authMiddleware from "../middlewares/auth.middleware"

const router = express.Router()


/**
* - Register Controller
* - POST /api/auth/register
* - Protected Route
*/

router.post("/",authMiddleware,)


export default router