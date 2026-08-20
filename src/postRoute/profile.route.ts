import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();


// =====================================================
// UPDATE BIO
// PATCH /profile/bio
// =====================================================

router.patch(
    "/bio",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId, bio } = req.body;

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: "userId is required.",
                });
            }

            if (typeof bio !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Bio must be a string.",
                });
            }

            const trimmedBio = bio.trim();

            if (trimmedBio.length > 160) {
                return res.status(400).json({
                    success: false,
                    message: "Bio cannot exceed 160 characters.",
                });
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                },
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    bio: trimmedBio || null,
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    bio: true,
                    image: true,
                },
            });

            return res.status(200).json({
                success: true,
                message: "Bio updated successfully.",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Update bio error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to update bio.",
            });
        }
    }
);


// =====================================================
// TOGGLE FOLLOW
// POST /profile/follow/toggle
// =====================================================

router.post(
    "/follow/toggle",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const {
                currentUserId,
                targetUserId,
            } = req.body;

            if (!currentUserId || !targetUserId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "currentUserId and targetUserId are required.",
                });
            }

            if (currentUserId === targetUserId) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot follow yourself.",
                });
            }

            // Check users
            const [currentUser, targetUser] =
                await Promise.all([
                    prisma.user.findUnique({
                        where: {
                            id: currentUserId,
                        },
                        select: {
                            id: true,
                        },
                    }),

                    prisma.user.findUnique({
                        where: {
                            id: targetUserId,
                        },
                        select: {
                            id: true,
                        },
                    }),
                ]);

            if (!currentUser) {
                return res.status(404).json({
                    success: false,
                    message: "Current user not found.",
                });
            }

            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: "Target user not found.",
                });
            }

            // Check existing follow
            const existingFollow =
                await prisma.follow.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: currentUserId,
                            followingId: targetUserId,
                        },
                    },
                });

            let isFollowing: boolean;

            // UNFOLLOW
            if (existingFollow) {
                await prisma.follow.delete({
                    where: {
                        id: existingFollow.id,
                    },
                });

                isFollowing = false;
            }

            // FOLLOW
            else {
                await prisma.follow.create({
                    data: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                });

                isFollowing = true;
            }

            // Updated target user counts
            const updatedTargetUser =
                await prisma.user.findUnique({
                    where: {
                        id: targetUserId,
                    },
                    select: {
                        _count: {
                            select: {
                                followers: true,
                                following: true,
                            },
                        },
                    },
                });

            return res.status(200).json({
                success: true,
                message: isFollowing
                    ? "User followed successfully."
                    : "User unfollowed successfully.",

                isFollowing,

                followersCount:
                    updatedTargetUser?._count.followers ?? 0,

                followingCount:
                    updatedTargetUser?._count.following ?? 0,
            });
        } catch (error) {
            console.error("Follow toggle error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to toggle follow.",
            });
        }
    }
);


// =====================================================
// GET PROFILE
// GET /profile/:username?currentUserId=xxx
// =====================================================

router.get(
    "/:username",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const username = req.params.username as string;

            const currentUserId =
                req.query.currentUserId as string | undefined;

            const profileUser =
                await prisma.user.findUnique({
                    where: {
                        username,
                    },
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        bio: true,
                        image: true,
                        createdAt: true,

                        _count: {
                            select: {
                                followers: true,
                                following: true,
                                posts: true,
                            },
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

            if (
                currentUserId &&
                currentUserId !== profileUser.id
            ) {
                const follow =
                    await prisma.follow.findUnique({
                        where: {
                            followerId_followingId: {
                                followerId: currentUserId,
                                followingId: profileUser.id,
                            },
                        },
                    });

                isFollowing = !!follow;
            }

            return res.status(200).json({
                success: true,

                profileUser: {
                    id: profileUser.id,
                    name: profileUser.name,
                    username: profileUser.username,
                    bio: profileUser.bio,
                    image: profileUser.image,
                    createdAt: profileUser.createdAt,

                    followersCount:
                        profileUser._count.followers,

                    followingCount:
                        profileUser._count.following,

                    postsCount:
                        profileUser._count.posts,
                },

                isFollowing,

                isOwnProfile:
                    currentUserId === profileUser.id,
            });
        } catch (error) {
            console.error("Fetch profile error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch profile.",
            });
        }
    }
);


export default router;