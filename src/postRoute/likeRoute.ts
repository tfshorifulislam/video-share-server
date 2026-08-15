import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/toggle", async (req: Request, res: Response): Promise<any> => {
    try {
        const { postId, userId } = req.body;

        if (!postId || !userId) {
            return res.status(400).json({
                success: false,
                message: "PostId and UserId are required.",
            });
        }

        const numericPostId = Number(postId);

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: numericPostId,
                    userId,
                },
            },
        });

        let liked = false;

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            liked = false;
        } else {
            await prisma.like.create({
                data: {
                    postId: numericPostId,
                    userId,
                },
            });
            liked = true;
        }

        // বর্তমান পোস্টের মোট লাইক সংখ্যা হিসাব করা
        const likesCount = await prisma.like.count({
            where: { postId: numericPostId },
        });

        return res.status(200).json({
            success: true,
            message: liked ? "Post liked successfully!" : "Post unliked successfully!",
            liked,
            likesCount,
        });

    } catch (error) {
        console.error("Error toggling like:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while liking post.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;