const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const sdk = require("api")("@d-id/v4.2.0#2f56dfsqlh4jniu8");
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
let resultURL = "";

sdk.auth(process.env.DID_API_KEY);

exports.getPITalk = async (res, req) => {
  const id = req.params.id;
  await sdk
    .getTalk({ id: id })
    .then(async ({ data }) => {
      console.log(data);

      const timeoutDuration = 30000; // Timeout duration in milliseconds (e.g., 30 seconds)
      const deadline = Date.now() + timeoutDuration;

      // Function to wait for status to be 'done' with a timeout
      const waitForCompletion = async () => {
        // Check if the status is 'done'
        if (data.status === "done") {
          const { result_url } = data;
          res.status(200).send(result_url);
        } else if (Date.now() >= deadline) {
          // If the deadline is reached, send a timeout error response
          res
            .status(408)
            .send("Timeout: The operation took longer than expected.");
        } else {
          // If status is not 'done' and deadline is not reached, wait for 1 second and then try again
          setTimeout(waitForCompletion, 1000);
        }
      };

      // Start the waiting loop
      await waitForCompletion();
    })
    .catch((err) => console.error(err));
};

exports.createPI = async (req, res) => {
  const createTalk = async () => {
    await sdk
      .createTalk({
        script: {
          type: "audio",
          provider: { type: "microsoft", voice_id: "en-US-JennyNeural" },
          ssml: "false",
          reduce_noise: "false",
          audio_url: audioURL,
        },
        config: { fluent: "false", pad_audio: "0.0" },
        driver_url: "bank://lively",
        source_url:
          "https://res.cloudinary.com/dqzpz4w3l/image/upload/v1683274865/bushiri-transformed_znyzq1_1_bchzcg.png",
      })
      .then(async ({ data }) => {
        console.log(data);
        const id = data.id;

        resultURL = id;
        res.status(200).send({ videoID: resultURL });
      })
      .catch((err) => console.error(err));
  };

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
      const writer = fs.createWriteStream(
        path.join(process.cwd(), "public", "output.mp3")
      );
      response.data.pipe(writer);
      writer.on("finish", () => {
        //Upload audio file to cloudinary
        uploadAudio();
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

  const uploadAudio = async () => {
    // Upload file to cloudinary
    await cloudinary.uploader
      .upload(path.join(process.cwd(), "public", "output.mp3"), {
        resource_type: "video",
      })
      .then(async (result) => {
        console.log(result);
        audioURL = result.secure_url;
        await createTalk();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Create audio file
  await createAudio(req.body.text);
};
