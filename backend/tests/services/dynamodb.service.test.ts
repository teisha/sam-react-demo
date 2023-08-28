import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { describe, expect, it, beforeEach } from "@jest/globals";
import { DynamoService } from "../../src/services/dynamodb.service";
import { connectDynamo, setupEnvironment } from "../testUtils";

// npm run backend:test -- cdk/tests/services/dynamodb.service.test.ts
describe("dynamodb service", () => {
  let dynamodb: DynamoDBClient;
  let dynamoService: DynamoService;
  beforeEach(() => {
    setupEnvironment();
    dynamodb = connectDynamo();
    dynamoService = new DynamoService("MailSort_dev", dynamodb);
  });
  it("saves and retrieves a record", async () => {
    const record = { PK: "one", SK: "two", attr1: "anything" };
    await dynamoService.deleteItem({ PK: "one", SK: "two" });
    const beforeRec = await dynamoService.getItem({ PK: "one", SK: "two" });
    expect(beforeRec.Item).toBeUndefined();

    const rec = await dynamoService.putItem(record);
    expect(rec).not.toBeUndefined();
    console.log("INSERT", JSON.stringify(rec?.Attributes));

    const afterRec = await dynamoService.getItem({ PK: "one", SK: "two" });
    console.log(afterRec.Item);
    expect(afterRec.Item).toEqual(record);
  });

  it("saves records in batches", async () => {
    const records = [
      { PK: "one", SK: "two", attr1: "anything" },
      {
        PK: "second",
        SK: "record",
        attr1: "horse innards",
      },
    ];
    await dynamoService.deleteItem({ PK: "one", SK: "two" });
    await dynamoService.deleteItem({ PK: "second", SK: "record" });

    const beforeRec = await dynamoService.getItem({ PK: "one", SK: "two" });
    expect(beforeRec.Item).toBeUndefined();

    const rec = await dynamoService.batchWrite(records);
    expect(rec).not.toBeUndefined();
    console.log("INSERT", JSON.stringify(rec.UnprocessedItems));

    let afterRec = await dynamoService.getItem({ PK: "one", SK: "two" });
    expect(afterRec.Item).toEqual(records[0]);
    afterRec = await dynamoService.getItem({ PK: "second", SK: "record" });
    expect(afterRec.Item).toEqual(records[1]);
  });
});
