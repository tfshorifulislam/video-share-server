import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post(
    "/",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const { content, postId, userId } = req.body;

            if (!content?.trim() || !postId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "content, postId and userId are required.",
                });
            }

            const numericPostId = Number(postId);

            if (!Number.isInteger(numericPostId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid postId is required.",
                });
            }

            const post = await prisma.post.findUnique({
                where: {
                    id: numericPostId,
                },
            });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: "Post not found.",
                });
            }

            const comment = await prisma.comment.create({
                data: {
                    content: content.trim(),
                    postId: numericPostId,
                    userId,
                },

                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },

                    post: {
                        select: {
                            userId: true,
                        },
                    },
                },
            });

            return res.status(201).json({
                success: true,
                message: "Comment added successfully.",
                comment,
            });
        } catch (error) {
            console.error("Error creating comment:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to create comment.",
            });
        }
    }
);

export default router;