import { APIGatewayAuthorizerResult } from "aws-lambda";

export function generatePolicy(
  principalId: string,
  effect: "Allow" | "Deny",
  resource: string,
): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
