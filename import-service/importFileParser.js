const s3 = require("./AWSS3");
const csv = require("csv-parser");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS();

module.exports.importFileParser = async (event, context) => {
  try {
    const record = event.Records[0];

    const s3Object = s3.getObject({
      Bucket: "aws-upload-buckett",
      Key: record.s3.object.key,
    });
    const s3Stream = s3Object.createReadStream();

    s3Stream
      .pipe(csv())
      .on("data", (row) => {
        const params = {
          QueueUrl:
            "https://sqs.eu-west-1.amazonaws.com/947103499873/catalogItemsQueue",
          MessageBody: JSON.stringify(row),
        };
        sqs.sendMessage(params, (err, data) => {
          if (err) {
            console.error("Error sending message to SQS:", err);
          }
        });
      })
      .on("end", async () => {
        const parsedKey = `parsed/${record.s3.object.key}`;

        const parsedFolderExists = await s3
          .listObjectsV2({
            Bucket: "aws-upload-buckett",
            Prefix: "parsed/",
          })
          .promise()
          .then((data) => data.Contents.length > 0);

        if (!parsedFolderExists) {
          await s3
            .putObject({
              Bucket: "aws-upload-buckett",
              Key: "parsed/",
            })
            .promise();
        }

        await s3
          .copyObject({
            Bucket: "aws-upload-buckett",
            CopySource: `/${s3Object.Bucket}/${record.s3.object.key}`,
            Key: parsedKey,
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: "aws-upload-buckett",
            Key: record.s3.object.key,
          })
          .promise();

        return {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ message: "File processing initiated" }),
        };
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
      });
  } catch (error) {
    console.error("Error processing S3 event:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
