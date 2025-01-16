import { Request, Response, Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import db from "@repo/db/prismaClient"
import { userMiddleware } from "../../middlewares/user";

export const userRouter = Router()

// This route updates avatar of the user
userRouter.put("/metadata", userMiddleware, async (req: Request, res: Response) => {
  try {
    const { avatarId } = UpdateMetadataSchema.parse(req.body)

    await db.user.update({
      where: {
        id: req.userId
      },
      data: {
        avatarId
      }
    })

    res.status(200).json({
      msg: "Avatar Updation Successfull"
    })
    return;
  } catch (error: any) {
    res.status(500).json({
      msg: error.message
    })
  }
})

userRouter.get("/metadata/bulk", async (req: Request, res: Response) => {
  try {
    const userIdsString = (req.query.ids ?? "[]") as string
    const userIds = userIdsString.slice(1, userIdsString.length - 2).split(",")

    const metadata = await db.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        avatar: {
          select: {
            imageUrl: true
          }
        },
        id: true
      }
    })

    res.status(200).json({
      avatars: metadata.map((user) => ({
        userId: user.id,
        imageUrl: user.avatar?.imageUrl
      }))
    })
  } catch (error) {
    
  }
})