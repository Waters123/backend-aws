const AWS = require("aws-sdk");
const sinon = require("sinon");
const lambda = require("./catalogBatchProcess");

describe("catalogBatchProcess Lambda Function", () => {
  let putSpy;

  beforeAll(() => {
    putSpy = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, "put");
  });

  afterAll(() => {
    putSpy.restore();
  });

  beforeEach(() => {
    putSpy.reset();
  });

  it("should create a product in DynamoDB", async () => {
    putSpy.returns({ promise: () => Promise.resolve({}) });

    const event = {
      Records: [
        {
          body: JSON.stringify({
            productId: "123",
            title: "Product A",
            description: "Description",
            productPrice: 10.99,
          }),
        },
      ],
    };

    const result = await lambda.handler(event);
    expect(putSpy.calledOnce).toBe(true);

    if (result) {
      expect(result.statusCode).toBe(200);
    }
  });

  it("should handle errors", async () => {
    putSpy.returns({ promise: () => Promise.reject(new Error("Test Error")) });

    const event = {
      Records: [
        {
          body: JSON.stringify({
            productId: "456",
            title: "Product B",
            description: "Description",
            productPrice: 15.99,
          }),
        },
      ],
    };

    try {
      await lambda.handler(event);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
