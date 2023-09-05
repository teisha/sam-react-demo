import axios, { Axios, AxiosInstance } from 'axios';
import { EnvironmentService } from '../services/environmentService';

var axiosInstance: AxiosInstance;

const instantiateAxios = (backendUrl: string) => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: backendUrl,
      responseType: 'json',
    });
    console.log('New Axios Instance Created for ' + backendUrl);
  }
  return axiosInstance;
};

export default instantiateAxios;
