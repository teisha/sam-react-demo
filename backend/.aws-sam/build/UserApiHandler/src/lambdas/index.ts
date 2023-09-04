import "reflect-metadata";
import { UserHandler } from "./UserHandler";
import { UserDynamoSchema } from "../services/dynamoSchemas/userSchema";
import { container } from "../dependencies/container";
import { APIGatewayProxyEvent } from 'aws-lambda';

// const dynamoService = new DynamoService(
//   Env.dynamoTable,
//   new DynamoDBClient({ region: process.env.REGION })
// );
// const userSchema: UserDynamoSchema = container.resolve(UserDynamoSchema);

export const userHandler = async (event: APIGatewayProxyEvent) => {
  const handler = container.resolve(UserHandler);
  return handler.handleEvent(event);
};
