import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rankpulseRouter from "./rankpulse";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rankpulseRouter);

export default router;
