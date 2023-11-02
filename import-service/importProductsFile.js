const s3 = require("./AWSS3");

module.exports.importProductsFile = async (event, context) => {
  try {
    if (!event.queryStringParameters || !event.queryStringParameters.name) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Missing fileName parameter" }),
      };
    }

    const name = event.queryStringParameters.name;
    const s3Params = {
      Bucket: "aws-upload-buckett",
      Key: `uploaded/${name}`,
      Expires: 300,
      ContentType: "text/csv",
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: signedUrl,
    };
  } catch (error) {
    return {
      statusCode: 500,

      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
