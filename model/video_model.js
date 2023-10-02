import mongoose from "mongoose";

const video_model = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  video_url: {
    type: String,
    default: "",
  },
  audio_url: {
    type: String,
    default: "",
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  transcription: {
    type: String,
    default: "",
  },
});

const Video = mongoose.model("Video", video_model);

export default Video;
