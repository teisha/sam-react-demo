import { UserDynamoSchema } from "../../src/services/dynamoSchemas/userSchema";
import { container } from "../helpers/dependencyContainer";
import { UserHandler } from "../../src/lambdas/UserHandler";

describe("lambdas/userHandler", () => {
  let handler: UserHandler;

  beforeEach(() => {
    handler = container.resolve(UserHandler);
  });
});
