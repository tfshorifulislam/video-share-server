import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();


router.get("/:username", async (req: Request, res: Response): Promise<any> => {
    try {
        const { username } = req.params;
        const currentUserId = req.query.currentUserId as string;

        const profileUser = await prisma.user.findUnique({
            where: { username },
            include: {
                _count: {
                    select: { followers: true, following: true },
                },
            },
        });

        if (!profileUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        let isFollowing = false;
        if (currentUserId && currentUserId !== profileUser.id) {
            const followCheck = await prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: profileUser.id,
                    },
                },
            });
            isFollowing = !!followCheck;
        }

        return res.status(200).json({
            success: true,
            profileUser,
            isFollowing,
        });

    } catch (error) {
        console.error("Fetch profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile.",
        });
    }
});


router.patch("/bio", async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, bio } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required.",
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { bio },
        });

        return res.status(200).json({
            success: true,
            message: "Bio updated successfully.",
            updatedUser,
        });

    } catch (error) {
        console.error("Update bio error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update bio.",
        });
    }
});


router.post("/follow/toggle", async (req: Request, res: Response): Promise<any> => {
    try {
        const { currentUserId, targetUserId } = req.body;

        if (!currentUserId || !targetUserId) {
            return res.status(400).json({
                success: false,
                message: "currentUserId and targetUserId are required.",
            });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself.",
            });
        }

        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });

        if (existingFollow) {
            await prisma.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });

            return res.status(200).json({
                success: true,
                isFollowing: false,
            });
        }

        await prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });

        return res.status(200).json({
            success: true,
            isFollowing: true,
        });

    } catch (error) {
        console.error("Follow toggle error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle follow.",
        });
    }
});

export default router;