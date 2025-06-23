import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { OpenMeteoClient } from "@/infrastructure/api/openMeteoClient";
import { SwapiClient } from "@/infrastructure/api/swapiClient";
import { FusionPlanetWeather } from "@/application/use-cases/FusionPlanetWeather";
import { FusedPlanetWeatherRepository } from "@/infrastructure/db/FusedPlanetWeatherRepository";
import { DynamoCache } from "@/infrastructure/cache/DynamoCache";

const useCase = new FusionPlanetWeather(
  new SwapiClient(),
  new OpenMeteoClient(),
  new FusedPlanetWeatherRepository(),
  new DynamoCache(),
);

export const handler: APIGatewayProxyHandlerV2 = async () => {
  try {
    const data = await useCase.execute();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in fusion:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
