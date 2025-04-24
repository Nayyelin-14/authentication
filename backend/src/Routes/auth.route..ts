import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshToken,
  registerHandler,
  resetAction,
  sendforgotPasswordAction,
  verifyEMailAction,
} from "../controllers/auth.con";
const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshToken);
authRoutes.post("/email/verify/:code", verifyEMailAction);
authRoutes.post("/password/forgot", sendforgotPasswordAction);
authRoutes.post("/password/reset", resetAction);
export default authRoutes;
