import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/toggle", async (req: Request, res: Response): Promise<any> => {
        try {
            const { postId, userId } = req.body;

            // Validate input
            if (!postId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "PostId and UserId are required.",
                });
            }

            const numericPostId = Number(postId);

            if (!Number.isInteger(numericPostId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid postId.",
                });
            }

            // Check if user already liked this post
            const existingLike = await prisma.like.findUnique({
                where: {
                    postId_userId: {
                        postId: numericPostId,
                        userId,
                    },
                },
            });

            let liked: boolean;

            if (existingLike) {
                // Already liked → Unlike
                await prisma.like.delete({
                    where: {
                        id: existingLike.id,
                    },
                });

                liked = false;
            } else {
                // Not liked → Like
                await prisma.like.create({
                    data: {
                        postId: numericPostId,
                        userId,
                    },
                });

                liked = true;
            }

            // Get updated like count
            const likesCount = await prisma.like.count({
                where: {
                    postId: numericPostId,
                },
            });

            return res.status(200).json({
                success: true,
                message: liked
                    ? "Post liked successfully!"
                    : "Post unliked successfully!",
                liked,
                likesCount,
            });
        } catch (error) {
            console.error("Error toggling like:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error while toggling like.",
            });
        }
    }
);

export default router;