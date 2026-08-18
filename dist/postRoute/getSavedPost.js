import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
// Get all saved posts of a user
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
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                postId_userId: {
                    postId: numericPostId,
                    userId,
                },
            },
        });
        return res.status(200).json({
            success: true,
            isSaved: Boolean(savedPost),
        });
    }
    catch (error) {
        console.error("Error checking save status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check save status.",
        });
    }
});
export default router;
