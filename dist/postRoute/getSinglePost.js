import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.get("/:id", async (req, res) => {
    try {
        const postId = Number(req.params.id);
        if (!Number.isInteger(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID.",
            });
        }
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                user: true,
            },
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found.",
            });
        }
        return res.status(200).json({
            success: true,
            post,
        });
    }
    catch (error) {
        console.error("Error fetching single post:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch post.",
        });
    }
});
export default router;
