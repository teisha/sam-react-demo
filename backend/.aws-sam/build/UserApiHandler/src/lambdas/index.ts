import "reflect-metadata";
import { UserHandler } from "./UserHandler";
import { container } from "../dependencies/container";
import { APIGatewayProxyEvent } from 'aws-lambda';

export const userHandler = async (event: APIGatewayProxyEvent) => {
  const handler = container.resolve(UserHandler);
  return handler.handleEvent(event);
};
