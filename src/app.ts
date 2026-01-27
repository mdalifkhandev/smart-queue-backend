import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import globalError from "./middleware/globalError";
import notFound from "./middleware/notFound";
import router from "./routes";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend is running');
});

app.use("/api/v1", router);

app.use(globalError);
app.use(notFound);

export default app;
