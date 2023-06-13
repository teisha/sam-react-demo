import { DynamoDBClient,  } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommandOutput, DeleteCommandOutput, DynamoDBDocument, GetCommandOutput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';

const translateConfig = {
    marshallOptions: {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: true, // false, by default.
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: true, // false, by default.
    },
    unmarshallOptions : {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    }
}
export class DynamoService {
    protected ddbDocClient: DynamoDBDocument;

    constructor(protected tableName: string, protected client: DynamoDBClient ) {
        this.ddbDocClient = DynamoDBDocument.from(client, translateConfig);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async putItem(item: Record<string, any>): Promise<PutCommandOutput> {
        return await this.ddbDocClient.put({
            Item: item,
            TableName: this.tableName
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async batchWrite(items: Record<string, any>[]): Promise<BatchWriteCommandOutput> {
        const reqs = {
            [this.tableName] : items.map(item => ({PutRequest: {Item: item }} ))
        } 

        return await this.ddbDocClient.batchWrite({
            RequestItems: reqs 
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getItem(key: Record<string, any>): Promise<GetCommandOutput> {
        return await this.ddbDocClient.get({
            Key: key,
            TableName: this.tableName
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async deleteItem (key: Record<string, any>): Promise<DeleteCommandOutput> {
        return await this.ddbDocClient.delete({
            TableName: this.tableName,
            Key: key
        })
    }

/*
    Implement Query:
    import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

// Set the parameters.
export const params = {
  ExpressionAttributeNames: { "#r": "rank", "#y": "year" },
  ProjectionExpression: "#r, #y, title",
  TableName: "TABLE_NAME",
  ExpressionAttributeValues: {
    ":t": "MOVIE_NAME",
    ":y": "MOVIE_YEAR",
    ":r": "MOVIE_RANK",
  },
  KeyConditionExpression: "title = :t and #y = :y",
  FilterExpression: "info.#r = :r",
};

export const queryTable = async () => {
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    for (let i = 0; i < data.Items.length; i++) {
      console.log(
        "Success. Items with rank of " +
          "MOVIE_RANK" +
          " include\n" +
          "Year = " +
          data.Items[i].year +
          " Title = " +
          data.Items[i].title
      );
    }
  } catch (err) {
    console.log("Error", err);
  }
};
queryTable();


*/

}











/*
import { DynamoDB } from 'aws-sdk';
import { DeleteItemOutput, DocumentClient, Key, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { Inject } from 'typescript-ioc';
import { EnvConfigService } from './envConfigService';

/**
 * Utility for accessing S3 objects
 * Changes style from callbacks to promises for clarity
 * Add more functions as needed, try to follow this style
 /
export class DynamoService {
    private dynamoDb: DynamoDB.DocumentClient;

    constructor(@Inject config: EnvConfigService) {
        this.dynamoDb = new DocumentClient({ region: config.getRegion() });
    }

    public async batchGet(table: string, keys: Key[]): Promise<any[]> {
        const params = {
            RequestItems: {
                [table]: {
                    Keys: keys,
                },
            },
        };

        const result = await this.dynamoDb.batchGet(params).promise();
        return result.Responses[table];
    }

    public async get(table: string, key: any): Promise<any> {
        const params = {
            TableName: table,
            Key: key,
        };

        const result = await this.dynamoDb.get(params).promise();
        return result.Item;
    }

    public async query(table: string, keyConditionExpression: any, expressionAttributes: any): Promise<any> {
        const params = {
            TableName: table,
            KeyConditionExpression: keyConditionExpression, //Example: 'contactId = :contactId',
            ExpressionAttributeValues: expressionAttributes, // Example: {":contactId": contactId}
        };

        //Do not use scan - use query
        const result = await this.dynamoDb.query(params).promise();
        console.log('Found # of results', result.Count);
        return result.Items;
    }

    public put(table: string, data: any): Promise<PutItemOutput> {
        const params = {
            Item: data,
            TableName: table,
        };

        return this.dynamoDb.put(params).promise();
    }

    public delete(table: string, key: string, ts: number): Promise<DeleteItemOutput> {
        const params = {
            Key: {
                contactId: key,
                timeStamp: ts,
            },
            TableName: table,
        };

        return this.dynamoDb.delete(params).promise();
    }

}

*/