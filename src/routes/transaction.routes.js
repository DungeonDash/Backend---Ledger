import express from "express"
import {authMiddleware, authSystemUserMiddleware} from "../middlewares/auth.middleware.js"
import {createTransactionController} from "../controller/transaction.controller.js"

const router = express.Router()

router.post("/", authMiddleware, createTransactionController)
router.post("/system/initial-funds", authSystemUserMiddleware, createTransactionController)


export default router