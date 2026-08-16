import express, { Application, Request, Response } from "express";
import cors from 'cors';

import createPostRouter from "./postRoute/createPost";
import allPostRouter from "./postRoute/getAllPost"
import getAllLike from "./postRoute/getLikeRoute"
import commentRouter from "./postRoute/getComments"

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
app.use("/api/users", allPostRouter);

//get all like
app.use("/api/like", getAllLike);

//get all comments;
app.use("/api/comments", commentRouter);

export default app;