import axios from 'axios';
import { useRef } from 'react';

export const useAxiosPublic = () => {
  const axiosInstance = useRef(axios.create({ baseURL: 'http://localhost:3000' }));

  return axiosInstance.current;
};
