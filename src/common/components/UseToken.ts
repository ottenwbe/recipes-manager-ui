import { useState } from 'react';

interface UserToken {
  token: string;
}

export function useToken() {
  const getToken = (): string | undefined => {
    const tokenString = localStorage.getItem('token');
    if (tokenString === null) {
      return undefined;
    }
    const userToken = JSON.parse(tokenString) as UserToken | null;
    return userToken?.token
  };

  const [token, setToken] = useState<string | undefined>(getToken());

  const saveToken = (userToken: UserToken): void => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }
}