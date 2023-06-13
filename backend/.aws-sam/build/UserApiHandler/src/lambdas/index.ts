import { UserSchema } from "../services/schemas/userSchema";
import { Env } from "../services/environment.service";
import { DynamoService } from "../services/dynamodb.service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserHandler } from "./UserHandler";

const dynamoService = new DynamoService(
  Env.dynamoTable,
  new DynamoDBClient({ region: process.env.REGION })
);
const userSchema: UserSchema = new UserSchema(dynamoService);

export const getUserHandler = async (event) => {
  const handler = new UserHandler(userSchema);
  return handler.handleEvent(event);
};
