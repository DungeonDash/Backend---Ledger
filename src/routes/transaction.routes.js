import express from "express"
import {authMiddleware, authSystemUserMiddleware} from "../middlewares/auth.middleware.js"
import {createTransactionController, createInitialFundsController} from "../controller/transaction.controller.js"

const router = express.Router()

router.post("/", authMiddleware, createTransactionController)
router.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsController)


export default router