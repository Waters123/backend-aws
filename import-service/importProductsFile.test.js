const { importProductsFile } = require("./importProductsFile");

describe("importProductsFile Lambda Function", () => {
  it("should return a signed URL when provided a valid name parameter", async () => {
    const event = {
      queryStringParameters: {
        name: "example.csv",
      },
    };
    const context = {};

    const response = await importProductsFile(event, context);

    expect(response.statusCode).toBe(200);
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(response.headers["Access-Control-Allow-Credentials"]).toBe(true);

    expect(typeof response.body).toBe("string");
  });

  it("should return a 400 status code when missing the name parameter", async () => {
    const event = {};
    const context = {};

    const response = await importProductsFile(event, context);

    expect(response.statusCode).toBe(400);
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(response.headers["Access-Control-Allow-Credentials"]).toBe(true);
  });

  it("should return a 500 status code in case of an error", async () => {
    const event = {
      queryStringParameters: {
        name: "example.csv",
      },
    };
    const context = {};

    const mockGetSignedUrlPromise = jest
      .fn()
      .mockRejectedValue(new Error("Mocked Error"));
    const AWSMock = require("aws-sdk");

    AWSMock.S3.prototype.getSignedUrlPromise = mockGetSignedUrlPromise;

    const response = await importProductsFile(event, context);

    expect(response.statusCode).toBe(500);
  });
});
