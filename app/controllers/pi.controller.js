const axios = require("axios");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: "dqzpz4w3l",
  api_key: "572199751471922",
  api_secret: "-qhTCNdgrKKZ0fLpi5IBa7VMjVA",
});

const CHUNK_SIZE = 1024;
const url =
  "https://api.elevenlabs.io/v1/text-to-speech/GyXKLdSk9ixiwbpafwHE/stream";
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
          } else {
            console.log(result);
            audioURL = result.secure_url;
            console.log("Audio file created successfully");
            res.status(200).json({
              message: "Audio file created successfully",
              audioURL: audioURL,
            });
          }
        }
      );

      response.data.pipe(uploadStream);

      console.log("File saved successfully!");
    } catch (error) {
      console.error(error);
      console.log("Error occurred while fetching speech data");
    }
  };

  //Create audio file
  await createAudio(req.body.text);
};
