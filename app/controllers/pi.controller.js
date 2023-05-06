const axios = require("axios");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const CHUNK_SIZE = 1024;
const url =
  "https://api.elevenlabs.io/v1/text-to-speech/xSU92nC1OTAcq0Hlgd4v/stream";
const headers = {
  Accept: "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": process.env.ELEVENLABS_API_KEY,
};

let audioURL = "";

exports.createPI = async (req, res) => {
  const createAudio = async (text) => {
    const data = {
      text: text,
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
      },
    };
    try {
      const response = await axios.post(url, JSON.stringify(data), {
        headers: headers,
        responseType: "stream",
      });

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
        },
        (result, error) => {
          if (error) {
            console.log(error);
            return  res.status(500).send({ audioURL: error.secure_url });
          } else {

            return res.status(200).send({ audioURL: result.secure_url });
          }
        }
      );

      response.data.pipe(uploadStream);
    } catch (error) {
      console.error(error);
      console.log("Error occurred while fetching speech data");
    }
  };

  //Create audio file
  await createAudio(req.body.text);
};
