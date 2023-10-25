const AWS = require("aws-sdk");
const uuid = require("uuid");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.createProduct = async (event) => {
  const { title, description, price } = JSON.parse(event.body);

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      id: uuid.v4(),
      title,
      description,
      price,
    },
  };

  try {
    await dynamodb.put(params).promise();

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(params.Item, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Error creating the product" }),
    };
  }
};
