import generateUniqueId from "../utils/generate_id.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { extractAudio, mergeVideo } from "../utils/videoUtil.js";
import { requestTranscript } from "../utils/deepgram.js";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFilePath);

export async function test(req, res) {
  return res.send({
    status: "Videos Endpoint working!",
  });
}

export async function startRecording(req, res) {
  const uniqueId = generateUniqueId(8);
  const directoryPath = path.join(currentDirectory, uniqueId);
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
      res.status(500).send({
        status: "error",
        message: "Internal Server Error",
      });
    } else {
      console.log("Folder created successfully:", directoryPath);
      res.status(202).send({
        status: "success",
        id: uniqueId,
      });
    }
  });
}

export async function addData(req, res) {
  const { id } = req.params;
  if (!id)
    return res.status(401).send({
      status: "error",
      message: "You must provide an id to access this endpoint",
    });

  let data = [];

  req.on("data", (chunk) => {
    console.log(chunk);
    data.push(chunk);
  });
  req.on("end", () => {
    chunkCount++;
    const directoryPath = path.join(
      currentDirectory,
      id,
      `${generateUniqueId(4)}.mp4`
    );

    const chunkBuffer = Buffer.concat(data);
    fs.writeFileSync(directoryPath, chunkBuffer);

    res.status(202).send({
      status: "success",
      temp_chunk_path: directoryPath,
    });
  });
  req.on("error", (e) => {
    res.status(400).send({
      status: "failed",
      error: e.message,
    });
  });
}

export async function stopRecording(req, res) {
  const { id } = req.params;
  if (!id)
    return res.status(401).send({
      status: "error",
      message: "You must provide an id to access this endpoint",
    });

  try {
    mergeVideo(myPath(`${id}.mp4`), getAllFilesInDirectory(myPath(id)))
      .then((video) => {
        extractAudio(myPath(`${id}.mp3`), video)
          .then(async (audio) => {
            requestTranscript(audio)
              .then((transcription) => {
                return res.status(200).send({
                  status: "success",
                  data: {
                    video_path: video,
                    audio_path: audio,
                    transcription: transcription,
                  },
                });
              })
              .catch((err) => {
                throw new Error(err);
              });
          })
          .catch((e) => {
            throw new Error(e);
          });
      })
      .catch((e) => {
        throw new Error(e);
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).send({
      status: "failed",
      error: error.message,
    });
  }
}

function myPath(filename) {
  return path.join(currentDirectory, filename);
}

function getAllFilesInDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);

    const filePaths = files.map((file) => path.join(directoryPath, file));

    return filePaths;
  } catch (error) {
    console.error("Error:", error);
    throw new Error(error);
  }
}
