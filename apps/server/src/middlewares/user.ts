import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization // "Bearer asdfasdfasdfsdfkjewkjkrj"
  const userToken = header?.split(" ")[1];

  if(!userToken) {
    res.status(403).json({
      msg: "Unauthorized"
    })
    return;
  }

  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET as string) as { role: string, userId: string }
    req.userId = decoded.userId;
    next();

  } catch (error: any) {
    res.status(403).json({
      msg: error.message
    })
    return;
  }
}