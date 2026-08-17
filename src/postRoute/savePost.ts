import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();


// Save / Unsave post
router.post("/toggle", async (
    req: Request,
    res: Response
): Promise<any> => {
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
                message: "Invalid postId.",
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


        // Check already saved
        const existingSavedPost =
            await prisma.savedPost.findUnique({
                where: {
                    postId_userId: {
                        postId: numericPostId,
                        userId,
                    },
                },
            });


        // Unsave
        if (existingSavedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: existingSavedPost.id,
                },
            });

            return res.status(200).json({
                success: true,
                saved: false,
                message: "Post removed from saved posts.",
            });
        }


        // Save
        await prisma.savedPost.create({
            data: {
                postId: numericPostId,
                userId,
            },
        });

        return res.status(200).json({
            success: true,
            saved: true,
            message: "Post saved successfully.",
        });

    } catch (error) {
        console.error("Error toggling saved post:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save post.",
        });
    }
});

export default router;