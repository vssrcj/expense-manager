import axios from 'axios';
import { getAuthorization } from 'auth';
import history from './history';

async function request(data) {
   const authorization = getAuthorization();

   if (!authorization) {
      history.push('/login');
      console.warn('you are not authorized');
      return null;
   }

   try {
      return await axios({
         ...data,
         headers: { Authorization: `jwt ${authorization.token}` },
      });
   } catch (err) {
      if (err.response.status === 401) {
         history.push('/login');
         return null;
      }
      throw err;
   }
}

export default ['get', 'post', 'put', 'delete'].reduce((res, method) => ({
   ...res,
   [method]: (url, props) => request({ method, url, ...props }),
}), {});
