import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.post("/toggle", async (req, res) => {
    try {
        const { postId, userId } = req.body;
        if (!postId || !userId) {
            return res.status(400).json({
                success: false,
                message: "postId and userId are required.",
            });
        }
        const numericPostId = Number(postId);
        if (!Number.isInteger(numericPostId)) {
            return res.status(400).json({
                success: false,
                message: "Valid postId is required.",
            });
        }
        // Check whether the user already liked the post
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: numericPostId,
                    userId,
                },
            },
        });
        let isLiked;
        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            isLiked = false;
        }
        else {
            // Not liked → Like
            await prisma.like.create({
                data: {
                    postId: numericPostId,
                    userId,
                },
            });
            isLiked = true;
        }
        // Get updated total likes
        const likesCount = await prisma.like.count({
            where: {
                postId: numericPostId,
            },
        });
        return res.status(200).json({
            success: true,
            message: isLiked
                ? "Post liked successfully."
                : "Post unliked successfully.",
            isLiked,
            likesCount,
        });
    }
    catch (error) {
        console.error("Error toggling like:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle like.",
        });
    }
});
export default router;
