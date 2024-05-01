import { Request, Response, NextFunction } from "express"
import path from "path"
import fs from "fs"

export const extensionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (path.extname(req.path).length > 0) {
    return next()
  }

  const file = path.join(process.cwd(), "./dist/src", `${req.path}.js`)
  fs.access(file, fs.constants.F_OK, (err) => {
    if (!err) {
      req.url += ".js"
    }

    next()
  })
}
