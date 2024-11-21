import express from "express";
import EmailHandler from "../controllers/emailController.js";

const router = express.Router();

router.post("/sendmail", EmailHandler); // Make sure this matches the URL you're using

export default router;
