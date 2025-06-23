import { v4 as uuidv4 } from "uuid";
import { FusedRepository } from "../ports/FusedRepository";
import { CustomData } from "@/domain/entities/CustomData";

export class StoreCustomData {
  constructor(private readonly repo: FusedRepository) {}

  async execute(content: Record<string, unknown>): Promise<CustomData> {
    const data = new CustomData(uuidv4(), content);
    await this.repo.saveCustomData(data);
    return data;
  }
}
