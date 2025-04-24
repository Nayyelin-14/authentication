import { Router } from "express";

import {
  deleteSessionHandler,
  getSessionsHandler,
} from "../controllers/session.controller";

const sessinRoutes = Router();

sessinRoutes.get("/", getSessionsHandler);
sessinRoutes.delete("/:id", deleteSessionHandler);

export default sessinRoutes;
