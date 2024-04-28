const cors = require("cors");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { connect } = require("./database");
const { extensionMiddleware } = require("./middlewares/extension.middleware");

import mongoose from "mongoose";
import { Request, Response } from "express";
import TrackSchema from "./models/track.schema";
import { body, validationResult } from "express-validator";

const Track = mongoose.model("Track", TrackSchema);

connect();

const client = express();
const app = express();

app.use(cors({ preflightContinue: false, optionsSuccessStatus: 200 }));
app.use(extensionMiddleware);
app.use(express.static(path.join(__dirname, "./src")));
app.use(bodyParser.json());

app.post(
  "/track",
  [
    body("*.event").exists().bail().isString().withMessage("event must be a string").bail(),
    body("*.tags").exists().bail().isArray().withMessage("tags must be an array"),
    body("*.url").exists().bail().withMessage("url must be a valid URL"),
    body("*.title").exists().bail().isString().withMessage("title must be a string"),
    body("*.ts").exists().bail().isInt().withMessage("ts must be an integer"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    const events = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Track.insertMany(events)
      .then(() => {
        res.status(200).send("Data received");
      })
      .catch((err: any) => {
        console.error(err);
        res.status(422).send("Failed to insert data");
      });
  },
);

client.listen(50000, () => {
  console.log("Client is running on port 50000");
});

app.listen(8888, () => {
  console.log("Server is running on port 8888");
});

client.get(["/1.html", "/2.html", "/3.html"], (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./src/index.html"));
});
