import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";

import createPostRouter from "./postRoute/createPost.js";
import allPostRouter from "./postRoute/getAllPost.js";
import getAllLike from "./postRoute/getLikeRoute.js";
import createCommentsRouter from "./postRoute/postComments.js";
import getCommentRouter from "./postRoute/getComments.js";
import likeRouter from "./postRoute/likeRoute.js";
import savePostRouter from "./postRoute/savePost.js";
import savedPostRouter from "./postRoute/getSavedPost.js";
import getSinglePostRouter from "./postRoute/getSinglePost.js";
import commentLikeRouter from "./postRoute/commentLike.js";
import getCommentLikeRouter from "./postRoute/getCommentsWithLikes.js";

const app: Application = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running!");
});

//post create router;
app.use("/api/posts", createPostRouter);

// get all post router;
app.use("/api/users", allPostRouter);

//post like router;
app.use("/api/like", likeRouter);

//get all like at post router;
app.use("/api/like", getAllLike);

//create comments router;
app.use("/api/comments", createCommentsRouter);

//get commet router;
app.use("/api/comments", getCommentRouter);

// save post router;
app.use("/api/save", savePostRouter);

//get save post router ;
app.use("/api/save", savedPostRouter);

//dynamic post router ;
app.use("/api/posts", getSinglePostRouter);

//comment like router;
app.use("/api/comment-likes", commentLikeRouter);

// get comments like router ;
app.use("/api/get-comment-likes", getCommentLikeRouter);

export default app;