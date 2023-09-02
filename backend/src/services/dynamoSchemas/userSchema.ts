import {
  BatchWriteCommandOutput,
  DeleteCommandOutput,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { UserStatus, UserType } from "../../shared/schema/user.schema";
import { DynamoService } from "../dynamodb.service";
import { inject, injectable } from "tsyringe";

interface DbModel {
  PK: string;
  SK: string;
  status: UserStatus;
  firstname: string;
  lastname: string;
  email: string;
  dateCreated?: Date;
}

export const USER_PK = "USER";
@injectable()
export class UserDynamoSchema {
  constructor(@inject(DynamoService) private dynamo: DynamoService) {}

  async put(item: UserType): Promise<PutCommandOutput> {
    return await this.dynamo.putItem(this.convertItemToDbModel(item));
  }

  async putAll(items: UserType[]): Promise<BatchWriteCommandOutput> {
    return await this.dynamo.batchWrite(
      items.map((item) => this.convertItemToDbModel(item))
    );
  }

  async delete(username: string): Promise<DeleteCommandOutput> {
    const key = {
      PK: USER_PK,
      SK: username,
    };
    const response = await this.dynamo.deleteItem(key);
    console.log("Deleted: ", { response });
    return response;
  }

  async get(username: string): Promise<UserType | null> {
    const key = {
      PK: USER_PK,
      SK: username,
    };
    console.log("Get By Key: ", { key });
    const response = await this.dynamo.getItem(key);
    if (!response.Item) {
      return null;
    }
    return this.convertDbModelToItem(response.Item as DbModel);
  }

  convertItemToDbModel(item: UserType): DbModel {
    const model: DbModel = {
      PK: USER_PK,
      SK: item.username,
      status: item.status,
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      dateCreated: item.dateCreated,
    };
    return model;
  }

  convertDbModelToItem(data: DbModel): UserType {
    const item: UserType = {
      username: data.SK,
      status: data.status,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      dateCreated: data.dateCreated ?? new Date(),
    };
    return item;
  }
}
