const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getStocksList = async (event) => {
  const stocksTable = process.env.STOCKS_TABLE;

  try {
    const stocksParams = {
      TableName: stocksTable,
    };
    const stocksData = await dynamodb.scan(stocksParams).promise();
    const stocks = stocksData.Items;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(stocks, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Error fetching stocks" }),
    };
  }
};
