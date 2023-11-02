const s3 = require("./AWSS3");
const csv = require("csv-parser");

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
        console.log("CSV Record:", row);
      })
      .on("end", async () => {
        console.log("CSV parsing complete");

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
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
      });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "File processing initiated" }),
    };
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
