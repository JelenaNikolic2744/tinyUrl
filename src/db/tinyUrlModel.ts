import mongoose from "mongoose";

const TinyUrlSchema = new mongoose.Schema({
  originalUrl: { type: String },
  urlPart: { type: String },
  url: { type: String },
  clicks: [
    {
      numOfClicks: { type: Number },
      timestamp: { type: Date }
    }
  ]
});

const TinyUrl = mongoose.model("tinyUrls", TinyUrlSchema);

export { TinyUrl };
