import type { APIGatewayProxyEventV2 } from "aws-lambda";

export async function handler(event: APIGatewayProxyEventV2) {
  return {
    statusCode: 201,
    body: "",
  };
}
