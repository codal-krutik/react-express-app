import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/Index.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use('/api', routes);

await connectDB();

app.listen(port);
