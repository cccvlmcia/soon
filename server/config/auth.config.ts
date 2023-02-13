import oauth2 from "@fastify/oauth2";
import {haqqaton, SERVER_URI} from "@config/haqqaton.config";
const _google = haqqaton.oauth.google;
let callbackUri = `${SERVER_URI}${_google.redirectUri}`;
const googleAuth = {
  name: "googleOAuth2",
  scope: ["email", "profile"],
  credentials: {
    client: {id: _google.clientId, secret: _google.clientSecret},
    auth: oauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: _google.redirectPath,
  callbackUri,
  callbackUriParams: {
    access_type: "offline",
  },
};
const _kakao = haqqaton.oauth.kakao;
callbackUri = `${SERVER_URI}${_kakao.redirectUri}`;
const kakaoAuth = {
  name: "kakaoOAuth2",
  scope: ["account_email", "profile_nickname", "gender"],
  credentials: {
    client: {id: _kakao.clientId, secret: _kakao.clientSecret},
    auth: {
      authorizeHost: "https://kauth.kakao.com",
      authorizePath: "/oauth/authorize",
      tokenHost: "https://kauth.kakao.com",
      tokenPath: "/oauth/token",
    },
  },
  startRedirectPath: "/auth/kakao",
  callbackUri,
  callbackUriParams: {
    response_type: "code",
  },
};
export {googleAuth, kakaoAuth};
