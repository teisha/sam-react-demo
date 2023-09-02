import { container } from "tsyringe";

import { fromIni } from "@aws-sdk/credential-provider-ini";
import { DynamoService } from "../../src/services/dynamodb.service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Env } from "../../src/services/environment.service";
import { UserDynamoSchema } from "../../src/services/dynamoSchemas/userSchema";
import { UserHandler } from "../../src/lambdas/UserHandler";

process.env.PROFILE = "power-user";
process.env.REGION = "us-east-1";
process.env.DYNAMO_TABLE = "serverless-react-dev-table";
process.env.LOG_LEVEL = "debug"; // error, warn, info, debug
process.env.STAGE = "dev";

container
  .register(Env, { useClass: Env })
  .register(DynamoDBClient, { useClass: DynamoDBClient })
  .register(UserDynamoSchema, { useClass: UserDynamoSchema })
  .register(UserHandler, { useClass: UserHandler });

container.register("DYNAMO_TABLE", { useValue: process.env.DYNAMO_TABLE });
container.register(DynamoService, {
  useFactory: () =>
    new DynamoService(
      container.resolve("DYNAMO_TABLE"),
      new DynamoDBClient({
        credentials: fromIni({
          profile: process.env.PROFILE,
        }),
        region: process.env.REGION,
      })
    ),
});

export { container };
