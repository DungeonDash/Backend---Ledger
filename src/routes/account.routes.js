import express from "express"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import {createAccountController, getUserAccountsController, getAccountBalanceController} from "../controller/account.controller.js"

const router = express.Router()


/**
* - Register Controller
* - POST /api/auth/register
* - Protected Route
*/

router.post("/", authMiddleware, createAccountController)
router.get("/", authMiddleware, getUserAccountsController)
router.get("/balance/:accountId", authMiddleware, getAccountBalanceController)


export default router