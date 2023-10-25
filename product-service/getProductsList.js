const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getProductsList = async (event) => {
  const productsTable = process.env.PRODUCTS_TABLE;
  const stocksTable = process.env.STOCKS_TABLE;

  try {
    const productsParams = {
      TableName: productsTable,
    };
    const productsData = await dynamodb.scan(productsParams).promise();
    const products = productsData.Items;

    const stocksParams = {
      TableName: stocksTable,
    };
    const stocksData = await dynamodb.scan(stocksParams).promise();
    const stocks = stocksData.Items;

    const combinedProducts = products.map((product) => {
      const matchingStock = stocks.find(
        (stock) => stock.product_id === product.id
      );

      if (matchingStock) {
        return {
          id: product.id,
          count: matchingStock.count,
          price: product.price,
          title: product.title,
          description: product.description,
        };
      } else {
        return {
          id: product.id,
          count: 0,
          price: product.price,
          title: product.title,
          description: product.description,
        };
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(combinedProducts, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Error fetching products" }),
    };
  }
};
