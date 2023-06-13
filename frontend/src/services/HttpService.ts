import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useContext } from 'react';
import authContext from '../Auth/contexts/authContext';
import IAuthToken from '../Auth/models/IAuthToken';
import IUser from '../shared/models/IUser';
import axiosInstance from '../utils/axiosInstance';

interface IGetParams {
  url: string;
  objectName: string;
}

class HttpService {
  private handleError(error: unknown) {
    const navigate = useNavigate();
    console.error(JSON.stringify(error));

    let errorMessage = (error as unknown as Error).message;
    if ((error as unknown as AxiosError).response) {
      const err = error as unknown as AxiosError;
      if (err.response && err.response.status === 401) {
        navigate('/login?redirected=true');
      }
      errorMessage += err.response?.statusText;
    }
    return Promise.reject(new Error(errorMessage));
  }

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
      return this.handleError(error);
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
      return this.handleError(error);
    }
  }
}

export default HttpService;
