import express from "express";
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
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Server is running!");
});
// create new post
app.use("/api/posts", createPostRouter);
// find all posts
app.use("/api/users", allPostRouter);
// like route
app.use("/api/like", likeRouter);
// get all likes
app.use("/api/like", getAllLike);
// create a new comment
app.use("/api/comments", createCommentsRouter);
// get all comments
app.use("/api/comments", getCommentRouter);
// saved post route
app.use("/api/save", savePostRouter);
// get saved posts
app.use("/api/save", savedPostRouter);
// get single post
app.use("/api/posts", getSinglePostRouter);
// comment like route
app.use("/api/comment-likes", commentLikeRouter);
// get comment likes
app.use("/api/get-comment-likes", getCommentLikeRouter);
export default app;
