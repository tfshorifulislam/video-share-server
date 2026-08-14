import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.post("/create", async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, mediaUrls, userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required.",
            });
        }

        if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one media URL is required.",
            });
        }

        const newPost = await prisma.post.create({
            data: {
                title: title || "",
                mediaUrls,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating post.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;