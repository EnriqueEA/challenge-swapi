import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomData } from "@/domain/entities/CustomData";
import { FusedPlanetWeather } from "@/domain/entities/FusedPlanetWeather";
import { FusedRepository } from "@/application/ports/FusedRepository";

export class FusedPlanetWeatherRepository implements FusedRepository {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
    this.tableName = process.env.FUSED_TABLE || "FusedPlanetWeatherV2-dev";
  }

  async save(item: FusedPlanetWeather): Promise<void> {
    const id = `${item.planet.name}#${item.fusedAt}`;
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...item,
          id,
          PK: "PLANET_WEATHER",
          SK: id,
        },
      }),
    );
  }

  async saveCustomData(item: CustomData): Promise<void> {
    const id = `${item.id}#${item.createdAt}`;
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          ...item,
          id,
          PK: "CUSTOM_DATA",
          SK: id,
        },
      }),
    );
  }

  async getAllFused(
    limit: number = 10,
    startKey?: Record<string, unknown>,
  ): Promise<{
    items: FusedPlanetWeather[];
    lastEvaluatedKey?: Record<string, unknown>;
    hasMore: boolean;
  }> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": "PLANET_WEATHER",
        },
        ExclusiveStartKey: startKey,
        Limit: limit,
      }),
    );

    return {
      items: (result.Items || []) as FusedPlanetWeather[],
      lastEvaluatedKey: result.LastEvaluatedKey,
      hasMore: !!result.LastEvaluatedKey,
    };
  }
}
