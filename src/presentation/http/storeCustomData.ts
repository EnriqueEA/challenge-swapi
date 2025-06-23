import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { FusedPlanetWeatherRepository } from "@/infrastructure/db/FusedPlanetWeatherRepository";
import { StoreCustomData } from "@/application/use-cases/StoreCustomData";

const useCase = new StoreCustomData(new FusedPlanetWeatherRepository());

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const content = JSON.parse(event.body || "{}");
    if (!content) {
      return { statusCode: 400, body: "Missing content field" };
    }
    const data = await useCase.execute(content);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error in store:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
