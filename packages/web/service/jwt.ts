import type { Param$Login, Schema$Authenticated } from '@/typings';
import { routes } from '@/constants';
import { api } from './api';
import { login, refreshToken } from './auth';

let jwtToken: Schema$Authenticated | null = null;

export function clearJwtToken() {
  jwtToken = null;
}

const isExpired = (jwtToken: Schema$Authenticated) =>
  +new Date(jwtToken.expiry) - +new Date() <= 30 * 1000;

export async function getJwtToken(payload?: Param$Login) {
  if (!jwtToken || isExpired(jwtToken)) {
    jwtToken = await (payload ? login(payload) : refreshToken());
  }
  return jwtToken;
}

const excludeUrls = [routes.login, routes.refresh_token, routes.registration];

api.interceptors.request.use(async config => {
  if (config.url && !excludeUrls.includes(config.url) && jwtToken) {
    const { token } = await getJwtToken();
    config.headers['Authorization'] = 'bearer ' + token;
  }
  return config;
});
