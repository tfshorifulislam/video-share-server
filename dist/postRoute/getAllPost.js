import { Router } from "express";
import { prisma } from "../lib/prisma.js";
const router = Router();
router.get("/get-all-posts", async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit) || 10, 50);
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const posts = await prisma.post.findMany({
            take: limit + 1,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                title: true,
                description: true,
                media: true,
                createdAt: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        emailVerified: true,
                    },
                },
            },
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (posts.length > limit) {
            hasNextPage = true;
            posts.pop();
            nextCursor = posts[posts.length - 1].id;
        }
        return res.status(200).json({
            success: true,
            message: "Posts fetched successfully",
            data: posts,
            pagination: {
                nextCursor,
                hasNextPage,
            },
        });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
export default router;
