import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get('/get-all-users', async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                image: true,
                createdAt: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        media: true,
                        createdAt: true,
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "Users and posts fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default router;