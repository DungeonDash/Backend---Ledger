import express from "express"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {createAccountController} from "../controller/account.controller.js"

const router = express.Router()


/**
* - Register Controller
* - POST /api/auth/register
* - Protected Route
*/

router.post("/", authMiddleware, createAccountController)


export default router