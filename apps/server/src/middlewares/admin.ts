import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization // "Bearer asdfasdfasdfsdfkjewkjkrj"
  const adminToken = header?.split(" ")[1];

  if(!adminToken) {
    res.status(403).json({
      msg: "Unauthorized"
    })
    return;
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET as string) as { role: string, userId: string }

    if(decoded.role !== "Admin") {
      res.status(401).json({
        msg: "Unauthorized"
      })
      return;
    }

    req.userId = decoded.userId;
    next();

  } catch (error: any) {
    res.status(403).json({
      msg: error.message
    })
    return;
  }
}