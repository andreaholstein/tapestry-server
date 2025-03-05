import express from "express";
import * as usersController from "../../controllers/users-controller.js";
import authorize from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authorize, usersController.getUser);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.get("/", usersController.getUserByEmail);

export default router;
