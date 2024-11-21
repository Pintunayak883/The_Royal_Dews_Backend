import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/route.js"; // Make sure the router is correctly imported

// Load environment variables
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Ensure this is the correct frontend URL
    methods: "GET,POST", // Allowed methods
    allowedHeaders: "Content-Type", // Allowed headers
  })
);

// Increase the body size limit to 10MB or adjust as needed
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/user", router); // Attach the route to /user

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.BACKEND_URL}`);
});
