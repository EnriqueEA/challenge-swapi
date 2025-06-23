import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2 } from "aws-lambda";
import { FusedPlanetWeatherRepository } from "@/infrastructure/db/FusedPlanetWeatherRepository";
import { GetFusionHistory } from "@/application/use-cases/GetFusionHistory";
import { parseQueryParameters } from "../utils/parseQueryParameters";

const useCase = new GetFusionHistory(new FusedPlanetWeatherRepository());

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
) => {
  try {
    const { limit, offset: SK } = parseQueryParameters(
      event.queryStringParameters || {},
    );
    const PK = "PLANET_WEATHER";
    const startKey = SK ? { PK, SK } : undefined;

    const data = await useCase.execute(limit, startKey);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in getHistory handler:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    const statusCode =
      error instanceof Error && error.name === "ValidationError" ? 400 : 500;

    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
