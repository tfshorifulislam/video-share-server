import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.get("/status/:postId/:userId", async (req, res) => {
    try {
        const { postId, userId } = req.params;
        const numericPostId = Number(postId);
        if (!Number.isInteger(numericPostId) || !userId) {
            return res.status(400).json({
                success: false,
                message: "Valid postId and userId are required.",
            });
        }
        const [likesCount, existingLike] = await Promise.all([
            // Total likes
            prisma.like.count({
                where: {
                    postId: numericPostId,
                },
            }),
            // Current user's like
            prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId: numericPostId,
                        userId,
                    },
                },
            }),
        ]);
        return res.status(200).json({
            success: true,
            likesCount,
            isLiked: Boolean(existingLike),
        });
    }
    catch (error) {
        console.error("Error fetching like status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch like status.",
        });
    }
});
export default router;
