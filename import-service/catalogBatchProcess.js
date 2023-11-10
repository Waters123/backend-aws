const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const records = event.Records;

  for (const record of records) {
    const messageBody = JSON.parse(record.body);

    const product = {
      id: messageBody.productId,
      title: messageBody.title,
      description: messageBody.description,
      price: messageBody.productPrice,
    };

    const params = {
      TableName: "Products",
      Item: product,
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Created product: ${product.id}`);

      // Publish an event to the SNS topic
      const snsParams = {
        Message: `Product created: ${product.title}`,
        TopicArn: "arn:aws:sns:eu-west-1:947103499873:ProductTopic",
      };

      await sns.publish(snsParams).promise();
    } catch (error) {
      console.error(`Error creating product: ${product.id}`, error);
    }
  }
};
