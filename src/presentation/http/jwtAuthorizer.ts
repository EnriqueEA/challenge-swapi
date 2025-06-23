import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import jwt from "jsonwebtoken";
import { generatePolicy } from "../utils/generatePolicy";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const jwtAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event,
) => {
  const token = event.authorizationToken?.split(" ")[1];
  if (!token) {
    return generatePolicy("anonymous", "Deny", event.methodArn);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return generatePolicy("user", "Allow", event.methodArn);
  } catch {
    return generatePolicy("anonymous", "Deny", event.methodArn);
  }
};
