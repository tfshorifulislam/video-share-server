import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/get-all-posts",async (req: Request, res: Response): Promise<any> => {
        try {
            const posts = await prisma.post.findMany({
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
                        },
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },
            });

            return res.status(200).json({
                success: true,
                message: "All posts fetched successfully",
                data: posts,
            });
        } catch (error) {
            console.error("Error fetching posts:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
);

export default router;