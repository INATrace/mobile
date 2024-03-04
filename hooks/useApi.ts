import axios from 'axios';

export const useApi = () => {
  const makeRequest = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  return {
    makeRequest,
  };
};
