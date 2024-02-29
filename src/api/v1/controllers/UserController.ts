import { Request, Response } from "express"
import { UserEditRequestBody } from "../../../interfaces/UserInterfaces"
import { User } from "../models/User"
import { UserService } from "../services/UserService"
export class UserController {
    private userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    async updateAccount(req: Request, res: Response) {
        const sessionUser = req.session.user?.data as User
        if (!req.session.user) return res.redirect("/auth/logout")

        const data = {
            title: `Edit Account - ${sessionUser.username}`,
            description: `Edit your account, ${sessionUser.username}!`,
            user: sessionUser,
            error: null
        }

        const { username } = req.params
        if (!username)
            return res.render("pages/users/edit-account", {
                ...data,
                error: "Username is missing. Try to log into your account again."
            })

        const requestingBody = req.body as UserEditRequestBody
        if (!requestingBody)
            return res.render("pages/users/edit-account", { ...data, error: "You have not provided any data." })

        if (!requestingBody.currentPassword)
            return res.render("pages/users/edit-account", { ...data, error: "You must provide your current password." })

        const response = await this.userService.updateAccount(username, requestingBody)
        if (response.error) return res.render("pages/users/edit-account", { ...data, error: response.error })

        if (response.user) {
            req.session.user.data = response.user

            return req.session.save((err) => {
                if (err) {
                    console.error(err)
                    return res.render("pages/users/edit-account", { ...data, error: "Failed to save session." })
                }

                res.locals.user = response.user
                return res.status(302).redirect(`/dashboard/${response.user.username}`)
            })
        }

        return res.render("pages/users/edit-account", {
            ...data,
            error: "An unexpected error occurred."
        })
    }

    async deleteAccount(_req: Request, _res: Response) {
        // ...
    }
}
