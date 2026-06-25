//import axios from 'axios';

require("dotenv").config();
const express = require("express");
const cors= require("cors");
const admin = require("./firebaseAdminConfig");
//const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
//const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} = require("@aws-sdk/client-s3");
console.log("Loaded ENV Vars:");
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);


const app = express();
app.use(cors());
app.use(express.json());

const axios = require("axios");

const awss3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

});


//const axios = require('axios');
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  
  console.log("Server is running on http://localhost:3001");
});



const db = admin.firestore();

console.log("ENV:", {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKeyFirstLine: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30)
});

const AddNewOrder = async (newOrder) => {
  try {
    const parameters = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `Orders/${newOrder.id}.json`,
      Body: JSON.stringify(newOrder),
      ContentType: "application/json",
    };

    await awss3.send(new PutObjectCommand(parameters));
    console.log("Order uploaded to S3:", newOrder.id);
  } catch (error) {
    console.error("Couldn't add the items to the bucket:", error);
  }
};

db.collection("Orders").onSnapshot((snap) => {
  snap.docChanges().forEach((change) => {
    if (change.type === "added") {
      AddNewOrder({ id: change.doc.id, ...change.doc.data() });
    }
  });
});
//second route to get data from the s3 bucket
/*app.get("https://newdonut.s3.eu-north-1.amazonaws.com/orders.json", async (req, res) => {
  try {
    const getObjCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "orders.json",
    });

    const data = await awss3.send(getObjCommand);
    const bodyContents = await streamToString(data.Body);

    res.json(JSON.parse(bodyContents));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/

app.get("/orders", async (req, res) => {
  try {
    console.log("Fetching orders...");

    const list = await awss3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: "Orders/",
      })
    );

    const files = list.Contents || [];

    const orders = await Promise.all(
      files.map(async (file) => {
        try {
          const data = await awss3.send(
            new GetObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: file.Key,
            })
          );

          const body = await data.Body.transformToString();

          return JSON.parse(body);
        } catch (err) {
          console.log("Skipping bad file:", file.Key);
          return null;
        }
      })
    );

    // remove broken files
    const cleanOrders = orders.filter(Boolean);

    res.json(cleanOrders);

  } catch (err) {
    console.error("ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//import { ListObjectsV2Command } from "@aws-sdk/client-s3";


const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
