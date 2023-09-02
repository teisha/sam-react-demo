import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";

export const connectDynamo = () => {
  const client = new DynamoDBClient({
    credentials: fromIni({
      profile: process.env.PROFILE,
    }),
    region: process.env.REGION,
  });
  return client;
};

export const connectS3 = () => {
  const client = new S3Client({
    credentials: fromIni({
      profile: process.env.PROFILE,
    }),
    region: process.env.REGION,
  });
  return client;
};

