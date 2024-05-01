import { validationResult, body } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const validationMiddleware = [
  body().isArray().withMessage("Body should be an array"),
  body("*.event").notEmpty().withMessage("Event field cannot be empty").isString().withMessage("Event should be a text"),
  body("*.tags").notEmpty().withMessage("Tags field cannot be empty").isArray().withMessage("Tags should be an array"),
  body("*.url").notEmpty().withMessage("URL field cannot be empty").isString().withMessage("URL should be a valid URL"),
  body("*.title").notEmpty().withMessage("Title field cannot be empty").isString().withMessage("Title should be a text"),
  body("*.ts").notEmpty().withMessage("Timestamp field cannot be empty").isNumeric().withMessage("Timestamp should be a number"),

  (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["content-type"] !== "application/json") {
      return res.status(422).json({ message: "Invalid content type. Expected application/json" })
    }

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const messages = errors.array().reduce((acc, err: any) => {
        const field = err.path.replace(/\[\d+\]\./, "")

        return {
          [field]: err.msg
        }
      }, {})

      return res.status(422).json({ errors: messages, message: "Something went wrong" })
    }

    next()
  }
]