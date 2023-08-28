import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-providers';

export const connectDynamo = () => {
    const client = new DynamoDBClient({
        credentials: fromIni({
            profile: process.env.PROFILE,
        }),
        region: process.env.REGION
    })
    return client;
}

export const connectS3 = () => {
    const client = new S3Client({
        credentials: fromIni({
            profile: process.env.PROFILE,
        }),
        region: process.env.REGION        
    })
    return client;
}
export const setupEnvironment = () => {
    process.env.PROFILE = 'power-user';
    process.env.REGION = 'us-east-1';
    process.env.BUCKET = 'lsft-athena-investigations';
    process.env.EMAIL_FILE_KEY = 'mailSort/emails_consolidated.txt'   
    
}
