import { Router, Request, Response } from "express"
import { userRouter } from "./user"
import { spaceRouter } from "./space"
import { adminRouter } from "./admin"
import { SigninSchema, SignupSchema } from "../../types"
import { compare, hash } from "../../scrypt"
import db from '@repo/db/prismaClient'
import jwt from "jsonwebtoken"
import { ZodError } from "zod"

const router = Router()

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsedBody = SignupSchema.safeParse(req.body)

    if(!parsedBody.success) {
      res.status(400).json({
        msg: "Validation Failed"
      })
      return;
    }

    const hashedPassword = await hash(parsedBody.data.password)

    const user = await db.user.create({
      data: {
        name: parsedBody.data.name,
        email: parsedBody.data.email,
        username: parsedBody.data.username,
        password: hashedPassword,
        role: parsedBody.data.type
      }
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string)

    res.status(201).json({
      token,
      userId: user.id
    })

    return;

  } catch (error: any) {
    res.status(500).json({
      msg: error.message
    })
  }
})
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { username, password } = SigninSchema.parse(req.body)

    const userExists = await db.user.findFirst({
      where: {
        username
      }
    })

    if(!userExists) {
      res.status(404).json({
        msg: "user not found"
      })

      return;
    }

    const isPasswordValid = await compare(password, userExists.password)

    if(!isPasswordValid) {
      res.status(403).json({
        msg: "Wrong Credentials"
      })

      return;
    }

    const token = jwt.sign({ id: userExists.id }, process.env.JWT_SECRET as string)

    res.status(200).json({
      token,
      userId: userExists.id
    })

    return;
  } catch (error: any) {
    if(error instanceof ZodError) {
      res.status(400).json({
        msg: error.message
      })
      return;
    }

    res.status(500).json({
      msg: error.message
    })

  }
})

router.get("/elements", async (req: Request, res: Response) => {

})

router.get("/avatars", async (req: Request, res: Response) => {

})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)

export { router as v1Router }