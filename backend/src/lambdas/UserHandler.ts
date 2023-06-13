import { UserSchema } from "../services/schemas/userSchema";
import IUser from "../shared/models/IUser";
import { BaseHandler } from "./BaseLambda";
import { APIGatewayProxyEvent } from "aws-lambda";

export class UserHandler extends BaseHandler {
  constructor(private schema: UserSchema) {
    super();
  }

  async handleEvent(event: APIGatewayProxyEvent) {
    const { resource, httpMethod, pathParameters } = event;
    console.log(resource);
    if (httpMethod === "GET") {
      return this.getUser(pathParameters?.username);
    }
  }

  async getUser(username: string | undefined) {
    try {
      if (!username) {
        throw new Error("username is required");
      }
      const user: IUser = (await this.schema.get(username)) as IUser;

      return this.handleReturn(JSON.stringify(user));
    } catch (error) {
      console.log(`Username not processed: ${username}`, { error });
      return this.handleError(400, error.message);
    }
  }
}
