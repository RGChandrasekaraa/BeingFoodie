const AWS = require("aws-sdk");
require("dotenv").config();
const LOG_OBJECT_KEY = "logs.json";
const UNIQUE_IPS_OBJECT_KEY = "unique_ips.json";

// Configure AWS SDK (replace with your own credentials from the AWS console)
// These credentials expire after approx 6 hours, so you will need to refresh them
// It is recommended to put these credentials in an env file and use process.env to retrieve them
// On EC2, you can assign the ec2SSMCab432 IAM role to the instance and the SDK will automatically retrieve the credentials. This will also work from inside a Docker container.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "ap-southeast-2",
});

// Create an S3 client
const s3 = new AWS.S3();

// Specify the S3 bucket and object key
const bucketName = "beingfoodiebucket";
const objectKey = "text.json";

async function createS3bucket() {
  try {
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
}

// Upload the JSON data to S3
async function uploadJsonToS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(jsonData), // Convert JSON to string
    ContentType: "application/json", // Set content type
  };

  try {
    await s3.putObject(params).promise();
    console.log("JSON file uploaded successfully.");
  } catch (err) {
    console.error("Error uploading JSON file:", err);
  }
}

// Retrieve the object from S3
async function getObjectFromS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.getObject(params).promise();
    // Parse JSON content
    const parsedData = JSON.parse(data.Body.toString("utf-8"));
    console.log("Parsed JSON data:", parsedData);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function logRequest(logEntry) {
  let logs = [];
  try {
    const logData = await s3
      .getObject({ Bucket: bucketName, Key: LOG_OBJECT_KEY })
      .promise();
    logs = JSON.parse(logData.Body.toString("utf-8"));
  } catch (err) {
    // Handle error (like if the log file doesn't exist yet)
  }

  logs.push(logEntry);
  await s3
    .putObject({
      Bucket: bucketName,
      Key: LOG_OBJECT_KEY,
      Body: JSON.stringify(logs),
      ContentType: "application/json",
    })
    .promise();
}

async function updateUniqueVisitorCount(ipAddress) {
  let uniqueVisitors = {};
  try {
    const uniqueVisitorData = await s3
      .getObject({ Bucket: bucketName, Key: UNIQUE_IPS_OBJECT_KEY })
      .promise();
    uniqueVisitors = JSON.parse(uniqueVisitorData.Body.toString("utf-8"));
  } catch (err) {
    // Handle error (like if the unique visitors file doesn't exist yet)
  }

  if (!uniqueVisitors[ipAddress]) {
    uniqueVisitors[ipAddress] = true;
    await s3
      .putObject({
        Bucket: bucketName,
        Key: UNIQUE_IPS_OBJECT_KEY,
        Body: JSON.stringify(uniqueVisitors),
        ContentType: "application/json",
      })
      .promise();
  }
}

async function getVisitorCount() {
  let uniqueVisitors = {};
  try {
    const uniqueVisitorData = await s3
      .getObject({ Bucket: bucketName, Key: UNIQUE_IPS_OBJECT_KEY })
      .promise();
    uniqueVisitors = JSON.parse(uniqueVisitorData.Body.toString("utf-8"));
  } catch (err) {
    // Handle error (like if the unique visitors file doesn't exist yet)
  }

  return Object.keys(uniqueVisitors).length;
}

module.exports = { logRequest, updateUniqueVisitorCount, getVisitorCount };
