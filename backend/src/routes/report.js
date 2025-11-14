import { Router } from "express";
import {
  getReportById,
  getAdminReports,
} from "../controllers/reportController.js";

const router = Router();

router.get("/admin/reports", getAdminReports);
router.get("/:id", getReportById);

export default router;
