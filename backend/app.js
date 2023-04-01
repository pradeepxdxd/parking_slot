import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection from "./utils/dbConnection.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
connection();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static("uploads"));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
