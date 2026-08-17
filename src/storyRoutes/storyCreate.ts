import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();


router.post(
    "/",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const {
                userId,
                mediaUrl,
                mediaType,
            } = req.body;

            if (!userId || !mediaUrl || !mediaType) {
                return res.status(400).json({
                    success: false,
                    message: "userId, mediaUrl and mediaType are required",
                });
            }

            if (
                mediaType !== "image" &&
                mediaType !== "video"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid media type",
                });
            }

            const expiresAt = new Date(
                Date.now() + 24 * 60 * 60 * 1000
            );

            const story = await prisma.story.create({
                data: {
                    userId,
                    mediaUrl,
                    mediaType,
                    expiresAt,
                },
            });

            return res.status(201).json({
                success: true,
                story,
            });

        } catch (error) {
            console.error("CREATE STORY ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to create story",
            });
        }
    }
);


// =====================================================
// GET ACTIVE STORIES
// =====================================================

router.get(
    "/",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId } = req.query;

            const now = new Date();

            const stories = await prisma.story.findMany({
                where: {
                    expiresAt: {
                        gt: now,
                    },
                },

                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },

                    views: userId
                        ? {
                            where: {
                                userId: String(userId),
                            },

                            select: {
                                id: true,
                            },
                        }
                        : false,
                },

                orderBy: {
                    createdAt: "asc",
                },
            });

            return res.json({
                success: true,
                stories,
            });

        } catch (error) {
            console.error("GET STORIES ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch stories",
            });
        }
    }
);





export default router;