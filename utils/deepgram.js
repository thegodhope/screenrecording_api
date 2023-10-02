import pkg from '@deepgram/sdk';
const { Deepgram } = pkg;
import { configDotenv } from 'dotenv';
import fs from 'fs';
configDotenv();
const deepgramApiKey = process.env.DEEPGRAM_SECRET;

export function requestTranscript(pathToFile) {
  return new Promise((resolve, reject) => {
    const deepgram = new Deepgram(deepgramApiKey);
    const mimetype = 'audio/mp3';

    deepgram.transcription.preRecorded(
      { buffer: fs.readFileSync(pathToFile), mimetype },
      { smart_format: true, model: 'nova', language: 'en-US' }
    )
    .then((transcription) => {
      resolve(transcription);
    })
    .catch((err) => {
      reject(err);
    });
  });
}
