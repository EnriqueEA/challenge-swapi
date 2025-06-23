import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { WeatherAPIClient } from "@/infrastructure/api/WeatherAPIClient";
import { SwapiClient } from "@/infrastructure/api/SwapiClient";
import { FusionPlanetWeather } from "@/application/use-cases/FusionPlanetWeather";
import { FusedPlanetWeatherRepository } from "@/infrastructure/db/FusedPlanetWeatherRepository";
import { DynamoCache } from "@/infrastructure/cache/DynamoCache";

const useCase = new FusionPlanetWeather(
  new SwapiClient(),
  new WeatherAPIClient(),
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
      body: JSON.stringify({
        message:
          "Error: could not get the planet's weather according to the coordinates. Please try again.",
      }),
    };
  }
};
