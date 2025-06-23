import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { CacheService } from "@/application/ports/CacheService";

export class DynamoCache implements CacheService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly TTL_MINUTES = 30;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
    this.tableName = process.env.CACHE_TABLE || "FusedPlanetWeatherCache-dev";
  }
  private key(planetName: string): string {
    return `cache#${planetName.toLowerCase()}`;
  }

  async get<T>(planetName: string): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id: this.key(planetName) },
      }),
    );

    if (!result.Item) return null;

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = result.Item.expiresAt || 0;
    if (expiresAt < now) return null;

    return result.Item.data as T;
  }

  async set<T>(planetName: string, data: T): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const ttl = now + this.TTL_MINUTES * 60;
    console.log("222");
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          id: this.key(planetName),
          data,
          expiresAt: ttl,
        },
      }),
    );
  }
}
