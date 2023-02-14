import {getUserLogin} from "@user/service/UserLoginService";
import {LOGIN_STATUS} from "@user/UserConstants";
import jwt from "jsonwebtoken";
import {haqqaton} from "@config/haqqaton.config";
import {FastifyRequest, FastifyReply} from "fastify";
import {getUserAuthList} from "@user/service/UserAuthService";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_MALFORMED, ERROR_AUTH_NOAUTH, ERROR_AUTH_NOTEXISTS} from "@error/AuthCode";
import UserAuth from "@user/entity/UserAuth";
import {AUTH} from "@auth/AuthConstants";

const {token} = haqqaton;

export function parseJWT(token: string) {
  try {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return JSON.parse("{}");
  }
}

export const signJWT = async (payload: any, expiresIn = token.expiresIn) => {
  return jwt.sign(payload, token.secret, {expiresIn: expiresIn});
};

export const verifyJWT = async (_token: string): Promise<any> => {
  return jwt.verify(_token, token.secret);
};

//FIXME: nickname을 받지 않도록 변경해야 함. 실제 이름과 다르기 때문임
// 상관 없으려나? 어차피 ssoid 입력해서 조회하고, status를 반환하는거니깐
export const checkSSO = async (type: string, ssoid: string, params: {email?: string; nickname?: string}) => {
  const oauth = await getUserLogin(ssoid);
  if (oauth) {
  //FIXME: 로그인 하는데 파라미터를 더 받기 위해 가져옵니다 - 범수
    return {status: LOGIN_STATUS.LOGIN, userid: oauth.userid, ssoid, type, ...params};
  } else {
    return {status: LOGIN_STATUS.REGISTER, auth: {type, ssoid, ...params}};
  }
};

export const getCookie = (req: FastifyRequest, cookie: string) => {
  return req.unsignCookie(req.cookies[cookie] || "");
};
export const getAccessTokenCookie = (req: FastifyRequest) => {
  return getCookie(req, "access_token");
};
export const getRefreshTokenCookie = (req: FastifyRequest) => {
  return getCookie(req, "refresh_token");
};
//FIXME: 권한 전달해서 처리 필요
//*
type jwt = {
  userid: number;
  email: string;
  iat: number;
  exp: number;
};
export const authHandler = (authes?: string[]) => async (req: FastifyRequest<{Body: {jwt?: jwt}}>, reply: FastifyReply) => {
  try {
    const {jwt} = req.body;
    if (jwt) {
      const {userid} = jwt;
      const authList = await getUserAuthList(userid);
      const authids = [...authList?.map(({authid}) => authid), AUTH.USER];
      const hasAuth = authids?.filter(authid => authes?.includes(authid)).length > 0;
      if (authes && authes?.length > 0 && !hasAuth) {
        reply.code(ERROR_AUTH_NOAUTH).send("ERROR_AUTH_NOAUTH");
      } else {
        return true;
      }
    } else {
      reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
    }
  } catch (err: any) {
    console.error(err);
    if (err.message == "jwt expired") {
      //얘만 /auth/refreshToken 호출
      reply.code(ERROR_AUTH_EXPIRED).send("ERROR_AUTH_EXPIRED");
    } else if (err.message == "jwt malformed" || err.message == "invalid signature") {
      // 로그인으로 가야함.
      reply.code(ERROR_AUTH_MALFORMED).send("ERROR_AUTH_MALFORMED");
    }
  }
};
//*/
