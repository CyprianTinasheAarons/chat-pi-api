const axios = require("axios");
const fs = require("fs");
const path = require("path");
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
      //save file in public folder
      const name = `${new Date().getTime()}.mp3`;
      const writer = fs.createWriteStream(
        path.join(process.cwd(), "public", name)
      );
      response.data.pipe(writer);
      writer.on("finish", async () => {
        //Upload audio file to cloudinary
        await cloudinary.uploader
          .upload(path.join(process.cwd(), "public", name), {
            resource_type: "video",
          })
          .then(async (result) => {
            console.log(result);
            audioURL = result.secure_url;
            //Delete audio file from public folder
            fs.unlinkSync(path.join(process.cwd(), "public", name));
            
            return res.status(200).json({
              message: "Audio file created successfully",
              audioURL: audioURL,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        console.log("File saved successfully!");
      });

      writer.on("error", (error) => {
        console.error(error);
        console.log("Error occurred while saving file");
      });
    } catch (error) {
      console.error(error);
      console.log("Error occurred while fetching speech data");
    }
  };

  //Create audio file
  await createAudio(req.body.text);
};
