import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
    "/get-all-posts",
    async (req: Request, res: Response): Promise<any> => {

        try {

            const page = Math.max(
                Number(req.query.page) || 1,
                1
            );

            const limit = Math.min(
                Number(req.query.limit) || 10,
                50
            );

            const skip = (page - 1) * limit;

            const totalPosts = await prisma.post.count();

            const posts =
                await prisma.post.findMany({

                    skip,

                    take: limit,

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

                    orderBy: {
                        createdAt: "desc",
                    },

                });

            const totalPages =
                Math.ceil(
                    totalPosts / limit
                );

            const hasNextPage =
                page < totalPages;


            return res.status(200).json({

                success: true,

                message:
                    "Posts fetched successfully",

                data: posts,

                pagination: {

                    page,

                    limit,

                    totalPosts,

                    totalPages,

                    hasNextPage,

                },

            });

        } catch (error) {

            console.error(
                "Error fetching posts:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Internal server error",

            });

        }

    }
);

export default router;