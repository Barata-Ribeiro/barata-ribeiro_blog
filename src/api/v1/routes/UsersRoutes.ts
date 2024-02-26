import { Router } from "express"
import authMiddleware from "../../../middlewares/AuthMiddleware"
import { UserController } from "../controllers/UserController"

const routes = Router()
const userController = new UserController()

routes.put("/dashboard/:username", authMiddleware, (req, res, next) =>
    userController.updateAccount(req, res).catch(next)
)

routes.delete("/:username", authMiddleware, (req, res, next) => userController.deleteAccount(req, res).catch(next))

export default routes
