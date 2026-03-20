import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js"

dotenv.config();

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', routes);

await connectDB();

app.listen(port);
