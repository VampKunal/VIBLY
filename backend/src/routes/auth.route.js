import express from "express"
import {
    signup,
    login,
    logout,
    onboard
}from "./../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const routes = express.Router()


routes.post("/signup", signup)
routes.post("/login", login) 

routes.post("/logout", logout)
routes.post ("/onboarding",protectRoute,onboard)
routes.get("/me", protectRoute, (req, res) => {
    res.status(200).json({
        message: "User authenticated successfully",
        user: req.user,
    });
});


export default routes;

