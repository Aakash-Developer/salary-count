import express from "express";
import { departmentAction } from "../controllers/departmentController";

const departmentRouter = express.Router();

departmentRouter.get("/", departmentAction.getDepartments());

export { departmentRouter };
