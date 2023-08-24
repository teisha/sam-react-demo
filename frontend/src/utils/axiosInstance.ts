import axios, { Axios, AxiosInstance } from "axios"
import { useAppContext } from "../contexts/appContext";

var axiosInstance: AxiosInstance;

const instantiateAxios = () => {
  const appContext = useAppContext()
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: appContext.config.backendUrl,
      responseType: "json"
    })
  }
  return axiosInstance
}
axiosInstance = instantiateAxios();

export default axiosInstance;