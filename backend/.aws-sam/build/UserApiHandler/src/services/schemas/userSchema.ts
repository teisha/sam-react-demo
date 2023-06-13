import {
  BatchWriteCommandOutput,
  DeleteCommandOutput,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import IUser from "../../shared/models/IUser";
import { DynamoService } from "../dynamodb.service";

interface DbModel {
  PK: string;
  SK: string;
  status: "active" | "deactivated";
  firstname?: string;
  lastname?: string;
  email: string;
  dateCreated?: Date;
}

export const USER_PK = "USER";
export class UserSchema {
  constructor(private dynamo: DynamoService) {}

  async put(item: IUser): Promise<PutCommandOutput> {
    return await this.dynamo.putItem(this.convertItemToDbModel(item));
  }

  async putAll(items: IUser[]): Promise<BatchWriteCommandOutput> {
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

  async get(username: string): Promise<IUser | null> {
    const key = {
      PK: USER_PK,
      SK: username,
    };
    const response = await this.dynamo.getItem(key);
    if (!response.Item) {
      return null;
    }
    return this.convertDbModelToItem(response.Item as DbModel);
  }

  convertItemToDbModel(item: IUser): DbModel {
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

  convertDbModelToItem(data: DbModel): IUser {
    const item: IUser = {
      username: data.SK,
      status: data.status,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      dateCreated: data.dateCreated,
    };
    return item;
  }
}
