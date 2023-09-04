import "reflect-metadata";
import { container } from "../../helpers/dependencyContainer";
import { UserHandler } from "../../../src/lambdas/UserHandler";
import { UserStatus, UserType } from "../../../../shared/schema/user.schema";
import { UserDynamoSchema } from "../../../src/services/dynamoSchemas/userSchema";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoService } from "../../../src/services/dynamodb.service";
import { UserSchema } from "../../../src/shared/schema/user.schema";

describe("lambdas/userHandler", () => {
  const testUser = {
    username: "YogiNephew",
    status: UserStatus.ACTIVE,
    firstname: "BooBoo",
    lastname: "Bear",
    email: "booboobear_test@gmail.com",
    dateCreated: new Date("03-14-2025"),
  };

  describe("getUser", () => {
    let handler: UserHandler;
    let dynamoDb: UserDynamoSchema;
    let request: APIGatewayProxyEvent = {
      resource: "test-getter",
      httpMethod: "GET",
      pathParameters: {
        username: testUser.username,
      },
    } as unknown as APIGatewayProxyEvent;
    let response: APIGatewayProxyResult;

    beforeAll(async () => {
      dynamoDb = container.resolve(UserDynamoSchema);
      handler = container.resolve(UserHandler);

      await dynamoDb.put(testUser);
      response = await handler.handleEvent(request);
    });
    it("returns success code", () => {
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(200);
    });

    it("returns test user", () => {
      let userResponse: UserType = JSON.parse(response.body);

      expect({
        ...userResponse,
        dateCreated: new Date(userResponse.dateCreated),
      }).toEqual(testUser);
    });
  });

  describe("saveUser", () => {
    let handler: UserHandler;
    let dynamoDb: UserDynamoSchema;
    let request: APIGatewayProxyEvent = {
      resource: "test-save",
      httpMethod: "POST",
      body: JSON.stringify(testUser),
    } as unknown as APIGatewayProxyEvent;
    let response: APIGatewayProxyResult;

    beforeAll(async () => {
      dynamoDb = container.resolve(UserDynamoSchema);
      handler = container.resolve(UserHandler);
      console.log({ request });
      await dynamoDb.delete(testUser.username);
      response = await handler.handleEvent(request);
    });
    it("returns success code", () => {
      expect(response).not.toBeUndefined();
      expect(response.statusCode).toBe(200);
      expect(response.body).toBe(`User saved: {${testUser.username}}`);
    });
  });
});
