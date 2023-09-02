import { fromIni } from "@aws-sdk/credential-providers";
import { container } from "tsyringe";
import { DynamoService } from "../services/dynamodb.service";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Env } from "../services/environment.service";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { UserHandler } from "../lambdas/UserHandler";
import { UserDynamoSchema } from "../services/dynamoSchemas/userSchema";

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
        region: process.env.REGION,
      })
    ),
});

export { container };
