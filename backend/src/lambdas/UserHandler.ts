import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { UserDynamoSchema } from "../services/dynamoSchemas/userSchema";
import { UserSchema, UserType } from "../shared/schema/user.schema";

import { BaseHandler } from "./BaseLambda";
import { APIGatewayProxyEvent } from "aws-lambda";

@injectable()
export class UserHandler extends BaseHandler {
  constructor(
    @inject(UserDynamoSchema) private schema: UserDynamoSchema
  ) {
    super();
  }

  async handleEvent(event: APIGatewayProxyEvent) {
    const { resource, httpMethod } = event;
    console.log(resource);
    if (httpMethod === "GET") {
      return this.getUser(event.pathParameters?.username);
    } else if (httpMethod === "POST") {
      return this.saveUser(event.body);
    }
  }

  async getUser(username: string | undefined) {
    try {
      if (!username) {
        throw new Error("username is required");
      }
      const user: UserType = (await this.schema.get(username)) as UserType;

      return this.handleReturn(JSON.stringify(user));
    } catch (error) {
      console.log(`Username not processed: ${username}`, { error });
      return this.handleError(400, (error as Error).message);
    }
  }

  async saveUser(body: string | null) {
    try {
      if (!body) {
        throw new Error("body is required");
      }
      const userData = UserSchema.parse(JSON.parse(body));
      const response = await this.schema.put(userData);
      console.log({ response });

      return this.handleReturn("User Created");
    } catch (error) {
      console.log(`User data could not be processed: ${body}`, { error });
      return this.handleError(400, (error as Error).message);
    }
  }
}
