import { Env } from "../services/environment.service";
import { DynamoService } from "../services/dynamodb.service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserHandler } from "./UserHandler";
import { UserDynamoSchema } from "../services/dynamoSchemas/userSchema";

const dynamoService = new DynamoService(
  Env.dynamoTable,
  new DynamoDBClient({ region: process.env.REGION })
);
const userSchema: UserDynamoSchema = new UserDynamoSchema(dynamoService);

export const userHandler = async (event) => {
  const handler = new UserHandler(userSchema);
  return handler.handleEvent(event);
};
