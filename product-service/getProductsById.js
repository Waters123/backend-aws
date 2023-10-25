const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsById = async (event) => {
  const productId = event.pathParameters.productId;
  console.log("Product ID:", productId);

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: productId,
    },
  };

  try {
    const data = await dynamodb.get(params).promise();
    console.log("Data from DynamoDB:", data);

    if (!data.Item) {
      console.log("Product not found");
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data.Item, null, 2),
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Error fetching product" }),
    };
  }
};
