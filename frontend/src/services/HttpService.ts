import Router from 'next/router';
import { useContext } from 'react';
import authContext from '../context/auth-context';
import IAuthToken from '../models/IAuthToken';
import IUser from '../models/IUser';
import axiosInstance from '../utils/axiosInstance';

interface IGetParams {
  url: string;
  objectName: string;
}

class HttpService {
  async get(params: IGetParams, username: string, rawtoken: string): Promise<any> {
    if (!username || !rawtoken) {
      throw new Error('Cannot call backend API');
    }
    const app_user = username ? username : 'anonymous';
    console.log('GET: ' + JSON.stringify(params));
    try {
      const response = await axiosInstance.get(params.url, {
        withCredentials: false,
        headers: { Authorization: 'Bearer ' + rawtoken },
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to retrieve ${params.objectName} for ${app_user}`);
      console.error((error as unknown as Error).message);
      console.error(JSON.stringify(error));
      if (error?.response && error.response.status === 401) {
        Router.push('/login?redirected=true');
      }
      return Promise.reject(new Error(error.response || error.message));
    }
  }

  async post(url: string, queryData: any, rawtoken: string, username: string) {
    if (!rawtoken) {
      throw new Error('Cannot call backend API without security token');
    }
    console.log(`${username}:: POST: ${url}`);
    try {
      const response = await axiosInstance.post(
        url,
        {
          data: queryData,
          responseType: JSON,
          withCredentials: true,
        },
        {
          headers: { Authorization: 'Bearer ' + rawtoken },
        },
      );

      return response.data;
    } catch (error) {
      console.error(`${username}:: Failed to post ${JSON.stringify(queryData)} to ${url}`);
      console.error(JSON.stringify(error));
      if (error.response && error.response.status === 401) {
        Router.push('/login?redirected=true');
      }
      return Promise.reject(new Error(error.response || error.message));
    }
  }
}

export default HttpService;
