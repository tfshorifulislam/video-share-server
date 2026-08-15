import express, { Application, Request, Response } from "express";
import cors from 'cors';

import createPostRouter from "./postRoute/createPost";
import userRouter from "./postRoute/getAllPost"

const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, 
}));

app.use(express.json());



app.get("/", (req: Request, res: Response) => {
    res.send("Server is running!");
});

// create new post ;
app.use("/api/posts", createPostRouter);

// find all post ;
app.use("/api/users", userRouter);

export default app;