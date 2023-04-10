
interface IParams {
    [key: string]: any;
  }

export function getConfig(token?: string, params?: IParams){
    const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    const config = {
        withCredentials: true,
        headers,
        ...(params && { params }),
    }
    return config
}