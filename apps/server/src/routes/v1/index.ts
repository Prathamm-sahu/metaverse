import { Router, Request, Response } from "express"

const router = Router()

router.post("/signup", async (req: Request, res: Response) => {

})
router.post("/signin", async (req: Request, res: Response) => {

})
router.post("/signup", async (req: Request, res: Response) => {

})

router.get("/elements", async (req: Request, res: Response) => {

})

router.get("/avatars", async (req: Request, res: Response) => {

})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)

export { router as v1Router }