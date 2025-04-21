import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshToken,
  registerHandler,
} from "../controllers/auth.con";
const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshToken);

export default authRoutes;
