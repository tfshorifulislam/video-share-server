import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Get all saved posts of a user
router.get("/user/:userId", async (
    req: Request<{ userId: string }>,
    res: Response
): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required.",
            });
        }

        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId,
            },

            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            posts: savedPosts.map(
                (savedPost) => savedPost.post
            ),
        });

    } catch (error) {
        console.error("Error fetching saved posts:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch saved posts.",
        });
    }
});

export default router;