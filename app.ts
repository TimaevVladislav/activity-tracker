import mongoose from "mongoose"

const cors = require("cors")
const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

import { Request, Response } from "express"
const { extensionMiddleware } = require("./middlewares/extension.middleware")
const { validationMiddleware } = require("./middlewares/validation.middleware")

import TrackSchema from "./models/track.schema"
const Track = mongoose.model("Track", TrackSchema)

const client = express()
const app = express()

app.use(bodyParser.json())
app.use(cors({ preflightContinue: false, optionsSuccessStatus: 200 }))
app.use(extensionMiddleware)
app.use(express.static(path.join(__dirname, "./dist/src")))

app.post("/track", validationMiddleware, (req: Request, res: Response) => {
  const events = req.body

  Track.insertMany(events)
    .then(() => {
      console.log("Data received")
    })
    .catch((e: any) => {
      console.error(e)
    })

  res.status(200).send("Data received")
})

async function start() {
  try {
    mongoose
      .connect("mongodb://localhost:27017/app")
      .then(() => console.log("Connected to MongoDB"))
      .catch((e: any) => console.error("Failed to connect to MongoDB", e))

    client.listen(50000, () => console.log("Client is running on port 50000"))
    client.get(["/1.html", "/2.html", "/3.html"], (req: Request, res: Response) => res.sendFile(path.join(__dirname, "./src/index.html")))
    app.listen(8888, () => console.log("Server is running on port 8888"))
  } catch (e: any) {
    console.log("Server Error", e.message)
    process.exit(1)
  }
}

start()
