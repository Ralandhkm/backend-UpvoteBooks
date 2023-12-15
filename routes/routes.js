import express from "express";
import { getUser, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refresh } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get('/user', verifyToken, getUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refresh);
router.delete('/logout', verifyToken, Logout);

export default router;