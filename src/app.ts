import express, { Application, Request, Response } from "express";
import cors from 'cors';
import createPostRouter from "./postRoute/createPost";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running!");
});

app.use("/api/posts", createPostRouter);

export default app;