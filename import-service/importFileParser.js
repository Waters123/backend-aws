const s3 = require("./AWSS3");
const csv = require("csv-parser");

module.exports.importFileParser = async (event, context) => {
  try {
    const record = event.Records[0];

    const s3Object = s3.getObject({
      Bucket: "uploaddded",
      Key: record.s3.object.key,
    });

    const s3Stream = s3Object.createReadStream();

    s3Stream
      .pipe(csv())
      .on("data", (row) => {
        console.log("CSV Record:", row);
      })
      .on("end", () => {
        console.log("CSV parsing complete");
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
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
