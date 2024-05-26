import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { router } from "./routes.js";
import cors from 'cors'

const app = express();
app.use(cors())

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.connect("mongodb://0.0.0.0:27017/tinyUrl-database");
app.use(router);

app.listen(3000, () => {
  console.log("server is up on port 3000");
});
