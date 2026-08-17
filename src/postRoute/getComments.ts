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

            const numericPostId = Number(postId);

            if (!Number.isInteger(numericPostId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid postId is required.",
                });
            }

            const comments =
                await prisma.comment.findMany({
                    where: {
                        postId: numericPostId,

                        // Only main comments
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

                        // Get replies
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

            return res.status(200).json({
                success: true,
                comments,
            });

        } catch (error) {
            console.error(
                "Error fetching comments:",
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