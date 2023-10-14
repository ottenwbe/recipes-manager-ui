import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function saveToken(token) {
    cookies.set('token', token, {
        path: '/',
        httpOnly: false, // TODO
        secure: false // TODO
      });
}

export function ReadToken() {
    return cookies.get('token');
}