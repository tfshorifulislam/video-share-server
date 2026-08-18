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
        origin: "https://space-client-db8y.onrender.com",
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running!");
});

app.use("/api/posts", createPostRouter);
app.use("/api/users", allPostRouter);
app.use("/api/like", likeRouter);
app.use("/api/like", getAllLike);
app.use("/api/comments", createCommentsRouter);
app.use("/api/comments", getCommentRouter);
app.use("/api/save", savePostRouter);
app.use("/api/save", savedPostRouter);
app.use("/api/posts", getSinglePostRouter);
app.use("/api/comment-likes", commentLikeRouter);
app.use("/api/get-comment-likes", getCommentLikeRouter);

export default app;