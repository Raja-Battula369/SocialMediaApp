import axios from 'axios';

const Url = 'https://social-media-app-n391.vercel.app/';
//post fetch
const RouterFetchForPost = async (path, values, headers = '') => {
  const { data } = await axios.post(`${Url}${path}`, values, {
    headers: { Authorization: headers },
  });

  return data;
};

//patch
export const RouterFetchForPatch = async (url, value = '', headers = '') => {
  const { data } = await axios.patch(
    `${Url}${url}`,
    { ...value },
    {
      headers: { Authorization: headers },
    }
  );
  return data;
};

//get
export const RouterFetchForGet = async (url, headers) => {
  const { data } = await axios.get(`${Url}${url}`, {
    headers: { Authorization: headers },
  });
  return data;
};

export const RouterFetchForDelete = async (url, headers) => {
  const { data } = await axios.delete(`${Url}${url}`, {
    headers: { Authorization: headers },
  });
  return data;
};

export default RouterFetchForPost;
