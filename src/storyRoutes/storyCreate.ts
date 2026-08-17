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


// =====================================================
// GET USER STORIES
// =====================================================

router.get(
    "/user/:userId",
    async (
        req: Request,
        res: Response
    ): Promise<any> => {
        try {
            const { userId } = req.params;

            const stories = await prisma.story.findMany({
                where: {
                    userId,
                    expiresAt: {
                        gt: new Date(),
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

                    views: {
                        select: {
                            userId: true,
                        },
                    },
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
            console.error("GET USER STORIES ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch user stories",
            });
        }
    }
);


// =====================================================
// VIEW STORY
// =====================================================

router.post(
    "/:storyId/view",
    async (
        req: Request,
        res: Response
    ): Promise<any> => {
        try {
            const storyId = Number(req.params.storyId);
            const { userId } = req.body;

            if (!storyId || !userId) {
                return res.status(400).json({
                    success: false,
                    message: "storyId and userId are required",
                });
            }

            const story = await prisma.story.findFirst({
                where: {
                    id: storyId,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
            });

            if (!story) {
                return res.status(404).json({
                    success: false,
                    message: "Story not found or expired",
                });
            }

            await prisma.storyView.upsert({
                where: {
                    storyId_userId: {
                        storyId,
                        userId,
                    },
                },

                create: {
                    storyId,
                    userId,
                },

                update: {},
            });

            return res.json({
                success: true,
                message: "Story viewed",
            });

        } catch (error) {
            console.error("VIEW STORY ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to view story",
            });
        }
    }
);


// =====================================================
// DELETE STORY
// =====================================================

router.delete(
    "/:storyId",
    async (
        req: Request,
        res: Response
    ): Promise<any> => {
        try {
            const storyId = Number(req.params.storyId);

            if (!storyId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid story id",
                });
            }

            await prisma.story.delete({
                where: {
                    id: storyId,
                },
            });

            return res.json({
                success: true,
                message: "Story deleted",
            });

        } catch (error) {
            console.error("DELETE STORY ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to delete story",
            });
        }
    }
);


export default router;