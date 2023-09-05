import { useNavigate } from 'react-router-dom';
import { AxiosError, AxiosInstance } from 'axios';
import instantiateAxios from '../utils/axiosInstance';

interface IGetParams {
  url: string;
  objectName: string;
}

class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(backendUrl: string) {
    this.axiosInstance = instantiateAxios(backendUrl);
  }

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
      const response = await this.axiosInstance.get(params.url, {
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
    console.log(`${username}:: POST: ${url}`, { queryData });
    console.log({ rawtoken });
    try {
      const response = await this.axiosInstance.post(url, queryData, {
        withCredentials: false,
        headers: { Authorization: 'Bearer ' + rawtoken, 'Content-Type': 'application/json' },
      });

      return response.data;
    } catch (error) {
      console.error(`${username}:: Failed to post ${JSON.stringify(queryData)} to ${url}`);
      return this.handleError(error);
    }
  }
}

export default HttpService;
