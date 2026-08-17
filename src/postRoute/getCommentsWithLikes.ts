import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
    "/post/:postId",
    async (
        req: Request<{ postId: string }>,
        res: Response
    ): Promise<any> => {
        try {
            const { postId } = req.params;
            const { userId } = req.query;

            const numericPostId = Number(postId);

            if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid postId is required.",
                });
            }

            if (!userId || typeof userId !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Valid userId is required.",
                });
            }

            const comments = await prisma.comment.findMany({
                where: {
                    postId: numericPostId,
                    parentId: null,
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

                    likes: {
                        select: {
                            id: true,
                            userId: true,
                            commentId: true,
                            createdAt: true,
                        },
                    },

                    replies: {
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

                            likes: {
                                select: {
                                    id: true,
                                    userId: true,
                                    commentId: true,
                                    createdAt: true,
                                },
                            },
                        },

                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            });

            const formattedComments = comments.map((comment) => ({
                ...comment,

                isLiked: comment.likes.some(
                    (like) => like.userId === userId
                ),

                replies: comment.replies.map((reply) => ({
                    ...reply,

                    isLiked: reply.likes.some(
                        (like) => like.userId === userId
                    ),
                })),
            }));

            return res.status(200).json({
                success: true,
                comments: formattedComments,
            });
        } catch (error) {
            console.error(
                "Error fetching comments with likes:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch comments.",
            });
        }
    }
);

export default router;