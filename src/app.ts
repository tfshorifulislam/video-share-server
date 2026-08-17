import express, { Application, Request, Response } from "express";
import cors from 'cors';

import createPostRouter from "./postRoute/createPost";
import allPostRouter from "./postRoute/getAllPost"
import getAllLike from "./postRoute/getLikeRoute"
import createCommentsRouter from "./postRoute/postComments";
import getCommentRouter from "./postRoute/getComments"
import likeRouter from "./postRoute/likeRoute"
import savePostRouter from "./postRoute/savePost"
import savedPostRouter from "./postRoute/getSavedPost";
import getSinglePostRouter from "./postRoute/getSinglePost";
import commentLikeRouter from "./postRoute/commentLike";
import getCommentLikeRouter from "./postRoute/getCommentsWithLikes";
import storyRoutes from "./storyRoutes/storyCreate";

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

// like route ;
app.use("/api/like", likeRouter);
//get all like
app.use("/api/like", getAllLike);

// create a new comment;
app.use("/api/comments", createCommentsRouter);

//get all comments;
app.use("/api/comments", getCommentRouter);

// saved post route
app.use("/api/save", savePostRouter);

//get save post
app.use("/api/save", savedPostRouter);

//get single post
app.use("/api/posts", getSinglePostRouter);

//comment like route
app.use("/api/comment-likes", commentLikeRouter);

//Get comment like route
app.use("/api/get-comment-likes", getCommentLikeRouter);



export default app;