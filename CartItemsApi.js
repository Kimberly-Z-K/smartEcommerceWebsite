require("dotenv").config();
const express = require("express");
const admin = require("./firebaseAdminConfig");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");



console.log("Loaded ENV Vars:");
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);


const app = express();
app.use(express.json());

const awss3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

});
