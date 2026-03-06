import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Routes from "./routes/routes.js";
import errorHandler from "./utils/errorHandler.js";
import { ApiError } from "./utils/ApiError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/Uploads", express.static("uploads")); 
app.get("/", (req, res) => {
    res.json("Server is healthy! 💪");
});
 
app.use("/api", Routes());
app.use((req, res, next) => {
    next(new ApiError(404, "Route not found 🔴"));
  });
app.use(errorHandler);
export {app};