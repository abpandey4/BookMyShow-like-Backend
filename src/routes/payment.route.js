import { Router } from 'express';
import { 
    createPayment, 
    updatePaymentStatus,
    getPaymentById,
    getMyPayments,
    refundPayment,
    processRefund
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-payment", verifyJWT, createPayment);
router.get("/", verifyJWT, getMyPayments);
router.get("/:paymentId", verifyJWT, getPaymentById);
router.patch("/update-payment-status/:paymentId", verifyJWT, updatePaymentStatus);
router.patch("/refund/:paymentId", verifyJWT, refundPayment);
router.patch("/process-refund/:paymentId", processRefund);

export default router;