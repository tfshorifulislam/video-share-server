import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.post("/create", async (req, res) => {
    try {
        const { title, media, userId, description } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required.",
            });
        }
        if (!media || !Array.isArray(media) || media.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one media file is required.",
            });
        }
        const newPost = await prisma.post.create({
            data: {
                title: title || "",
                media,
                userId,
                description: description || "",
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
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating post.",
            error: error instanceof Error
                ? error.message
                : "Unknown error",
        });
    }
});
export default router;
