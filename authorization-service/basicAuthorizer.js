const base64 = require("base-64");

exports.basicAuthorizer = async (event, context) => {
  // Extract the Authorization header from the event
  const authorizationHeader = event.headers["Authorization"];

  // Check if the Authorization header is present
  if (!authorizationHeader) {
    return generateResponse(401, "Unauthorized");
  }

  // Extract the Basic token from the Authorization header
  const encodedCredentials = authorizationHeader.split(" ")[1];

  try {
    const decodedCredentials = base64.decode(encodedCredentials).split(":");
    const providedUsername = decodedCredentials[0];
    const providedPassword = decodedCredentials[1];

    // Retrieve credentials from environment variables
    const expectedUsername = process.env.YOUR_GITHUB_ACCOUNT_LOGIN;
    const expectedPassword = process.env.TEST_PASSWORD;

    // Check if provided credentials match the expected credentials
    if (
      providedUsername === expectedUsername &&
      providedPassword === expectedPassword
    ) {
      return generatePolicy("user", "Allow", event.methodArn);
    } else {
      return generateResponse(403, "Access Denied");
    }
  } catch (error) {
    return generateResponse(403, "Invalid Authorization Token");
  }
};

// Function to generate the policy
const generatePolicy = (principalId, effect, resource) => {
  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId: principalId,
    policyDocument: policyDocument,
  };
};

// Function to generate the HTTP response
const generateResponse = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ message: message }),
  };
};
