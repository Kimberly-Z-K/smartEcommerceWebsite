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


const axios = require('axios');

app.listen(3001, () => {
  
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

app.get("/", async (request, response) => {
  try {
    const Docs = await db.collection("Orders").get();
    let orders = {};
  Docs.forEach((doc) => {
  let data = doc.data();
  let email = data.email;

  if (email && typeof email === "string") {
    orders[email.toLowerCase()] = data;
  } else {
    console.warn(`Skipping document ${doc.id}: no valid email`);
  }
});


    const dataS = JSON.stringify(orders);

    const uploadParameters = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "orders.json",
      Body: dataS,
      ContentType: "application/json",
    };

    await awss3.send(new PutObjectCommand(uploadParameters));
    response.json({ message: "Data uploaded to S3 successfully!" });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

