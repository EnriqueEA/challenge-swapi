export class CustomData {
  public readonly createdAt: string;
  constructor(
    public id: string,
    public content: Record<string, unknown>,
  ) {
    this.createdAt = new Date().toISOString();
  }
}
