import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

router.post(
    "/",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const {
                content,
                postId,
                userId,
                parentId,
            } = req.body;

            // Required fields
            if (!content?.trim() || !postId || !userId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "content, postId and userId are required.",
                });
            }

            const numericPostId = Number(postId);

            if (!Number.isInteger(numericPostId)) {
                return res.status(400).json({
                    success: false,
                    message: "Valid postId is required.",
                });
            }

            // Check post
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

            // --------------------------------
            // Parent Comment
            // --------------------------------

            let numericParentId: number | null = null;

            if (
                parentId !== null &&
                parentId !== undefined &&
                parentId !== ""
            ) {
                numericParentId = Number(parentId);

                if (!Number.isInteger(numericParentId)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid parentId.",
                    });
                }

                // Check parent comment
                const parentComment =
                    await prisma.comment.findUnique({
                        where: {
                            id: numericParentId,
                        },
                    });

                if (!parentComment) {
                    return res.status(404).json({
                        success: false,
                        message: "Parent comment not found.",
                    });
                }

                // Parent comment must belong
                // to the same post
                if (
                    parentComment.postId !==
                    numericPostId
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Parent comment does not belong to this post.",
                    });
                }
            }

            // --------------------------------
            // Create Comment / Reply
            // --------------------------------

            const comment = await prisma.comment.create({
                data: {
                    content: content.trim(),
                    postId: numericPostId,
                    userId,
                    parentId: numericParentId,
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

                message: numericParentId
                    ? "Reply added successfully."
                    : "Comment added successfully.",

                comment,
            });

        } catch (error) {
            console.error(
                "Error creating comment:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create comment.",
            });
        }
    }
);

export default router;