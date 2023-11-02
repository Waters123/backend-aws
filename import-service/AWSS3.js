const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: "eu-west-1" });

module.exports = s3;
