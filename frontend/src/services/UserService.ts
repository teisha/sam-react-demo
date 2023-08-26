import IUser from '../shared/models/IUser';
import HttpService from './HttpService';

class UserService {
  httpService: HttpService;
  constructor(backendUrl: string) {
    this.httpService = new HttpService(backendUrl);
  }

  async getUserData(username: string, rawtoken: string): Promise<IUser> {
    console.log(`GET USERNAME FROM TOKEN: ${username}`);
    const params = {
      url: `users/${username}`,
      objectName: `pk='USER',sk='${username}'`,
    };
    try {
      const user_data = await this.httpService.get(params, username, rawtoken);
      console.log(`USER DATA FROM USERSERVICE: ${JSON.stringify(user_data)}`);
      return user_data as IUser;
      //get user data from token.email
    } catch (error) {
      console.error(`Could not retrieve user data for ${username}`);
      console.error((error as unknown as Error).message);
    }
    return {} as IUser;
  }
}

export default UserService;

/*

import IUser from '../shared/models/IUser';
import { getTRPCClient } from './trpcService';

export class UserService {
  constructor(private apiUrl: string) {}
  public async getUserData(username: string, authtoken: string): Promise<IUser> {
    
    const trpc = getTRPCClient(this.apiUrl, authtoken);
    const returnVal = await trpc.getUser.query({ username });
    if (returnVal.status !== 'success') {
      console.log(returnVal.status);
    }
    const { data } = returnVal;
    console.log({ data });
    // @ts-ignore
    return data.user;
    // return new Promise((resolve) => {
    //   return resolve({
    //     username: 'ahsiet4@yahoo.com', // Test1234!
    //     status: 'active',
    //     firstname: 'Bub',
    //     lastname: 'Meduza',
    //     email: 'test@test.com',
    //     date_created: new Date(),
    //   } as IUser);
    // });
  }
}
*/
