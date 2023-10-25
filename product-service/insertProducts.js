const AWS = require("aws-sdk");
const uuid = require("uuid");

AWS.config.update({ region: "eu-west-1" });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const products = [
  {
    id: uuid.v4(),
    title: "Product 1",
    description: "Description for Product 1",
    price: 10,
  },
  {
    id: uuid.v4(),
    title: "Product 2",
    description: "Description for Product 2",
    price: 20,
  },
  {
    id: uuid.v4(),
    title: "Product 3",
    description: "Description for Product 3",
    price: 30,
  },
];

const stocks = [
  {
    product_id: products[0].id,
    count: 100,
  },
  {
    product_id: products[1].id,
    count: 50,
  },
  {
    product_id: products[2].id,
    count: 25,
  },
];

async function insertData() {
  for (const product of products) {
    const params = {
      TableName: "Products",
      Item: product,
    };
    await dynamodb.put(params).promise();
  }

  for (const stock of stocks) {
    const params = {
      TableName: "Stocks",
      Item: stock,
    };
    await dynamodb.put(params).promise();
  }
}

insertData()
  .then(() => console.log("Test data inserted successfully."))
  .catch((error) => console.error("Error inserting test data:", error));
