import ffprobeins from "@ffprobe-installer/ffprobe";
import ffmpegins from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegins.path);
ffmpeg.setFfprobePath(ffprobeins.path);

export function mergeVideo(filepath, paths) {
  return new Promise((resolve, reject) => {
    try {
      const command = ffmpeg();

      paths.forEach((path) => {
        command.input(path);
      });

      command
        .on("error", function (err) {
          reject(new Error(err));
        })
        .on("end", function () {
          resolve(filepath);
        });

      command.mergeToFile(filepath);
    } catch (error) {
      reject(new Error(error));
    }
  });
}

export function extractAudio(audioPath, videoPath) {
  return new Promise((resolve, reject) => {
    try {
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("libmp3lame")
        .on("error", function (err) {
          reject(new Error(err));
        })
        .on("end", function () {
          console.log("Finished extracting audio.");
          resolve(audioPath);
        })
        .save(audioPath);
    } catch (error) {
      console.error("Error:", error);
      reject(new Error(error));
    }
  });
}
