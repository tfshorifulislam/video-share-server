import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.post("/toggle", async (req, res) => {
    try {
        const { commentId, userId } = req.body;
        if (!commentId || !userId) {
            return res.status(400).json({
                success: false,
                message: "commentId and userId are required.",
            });
        }
        const numericCommentId = Number(commentId);
        if (!Number.isInteger(numericCommentId)) {
            return res.status(400).json({
                success: false,
                message: "Valid commentId is required.",
            });
        }
        const comment = await prisma.comment.findUnique({
            where: {
                id: numericCommentId,
            },
        });
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
        }
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId: numericCommentId,
                    userId,
                },
            },
        });
        if (existingLike) {
            await prisma.commentLike.delete({
                where: {
                    id: existingLike.id,
                },
            });
            const likesCount = await prisma.commentLike.count({
                where: {
                    commentId: numericCommentId,
                },
            });
            return res.status(200).json({
                success: true,
                isLiked: false,
                likesCount,
            });
        }
        await prisma.commentLike.create({
            data: {
                commentId: numericCommentId,
                userId,
            },
        });
        const likesCount = await prisma.commentLike.count({
            where: {
                commentId: numericCommentId,
            },
        });
        return res.status(200).json({
            success: true,
            isLiked: true,
            likesCount,
        });
    }
    catch (error) {
        console.error("Comment like toggle error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle comment like.",
        });
    }
});
export default router;
