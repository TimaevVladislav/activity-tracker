import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/app")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: any) => console.error("Failed to connect to MongoDB", err));
};
