import {addLoginHistory} from "@user/service/LoginHistoryService";
import {getUserLogin} from "@user/service/UserLoginService";
import {editUserRefresh, getUserInfoByRefreshToken} from "@user/service/UserService";
import {signJWT, verifyJWT} from "@utils/OAuth2Utils";
import {decrypted, encrypted} from "@utils/CipherUtils";
import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import google from "./google";
import kakao from "./kakao";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_NOTEXISTS, ERROR_AUTH_REFRESH_EXPIRED, ERROR_AUTH_TOKEN_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
export default async function (fastify: FastifyInstance) {
  // google(fastify);
  fastify.register(google, {prefix: "/google"});
  fastify.register(kakao, {prefix: "/kakao"});
  /*
      1. ssoid, userid로 사용자 정보를 조회
      1-1. access있으면 jwt sign {userid, ssoid, email}
      1-2. 없으면 error 던짐
      
      2. jwt sign하고, encrypted(access)
      
      3. user가 refresh_token 가지고 있는지 확인
      3-1. refresh_token 있으면 복호화 해서 검증
      3-1-1. 검증결과 문제 없으면 발급
      3-1-2. 검증결과 문제 있으면 error 던짐

      3-2. refresh_token 없으면 새로 발급
      3-2-1. 발급한 토큰을 사용자 테이블에 저장.

      4. set-cookie{sign} [access_token, refresh_token]
      5. 발급한 access_token LoginHistory에 저장
      6. reply.send(access_token)
    */
  fastify.post("/token", async (req: FastifyRequest<{Body: {ssoid: string; userid: number}}>, reply: FastifyReply) => {
    // 사용자가 SSO Login을 하고 입력을 하고, 토큰을 요청할 때 호출한다
    const {ssoid, userid} = req.body;

    const user = await getUserLogin(ssoid, userid); //db에 저장된 유저의 정보를 가지고 온다.

    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS"); //유저가 있어서 token을 요청했는데 없으니가 에러를 일으킨다.
    }
    // 액세스 토큰을 만든다. refresh token은 일단, 액세스 토큰과 동일하다
    const {userid: userId, email} = user;
    const access = await signJWT({userid: userId, ssoid, email});
    const accessToken = encrypted(access);

    // refresh 토큰을 재발급 받는 과정이다
    let refreshToken = user?.user?.refresh_token || "";
    if (refreshToken) {
      // refresh 토큰이 있다면 복호화하고 검증한다
      try {
        const decryptStr = decrypted(refreshToken);
        await verifyJWT(decryptStr);
      } catch (err) {
        // 유효하지 않은 토큰이 있다면 다시 업데이트 한다
        const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
        refreshToken = encrypted(refresh);
        await editUserRefresh(userId, {refresh_token: refreshToken});
      }
    } else {
      const refresh = await signJWT({userid: userId, ssoid, email}, "30d");
      refreshToken = encrypted(refresh);
      await editUserRefresh(userId, {refresh_token: refreshToken});
    }

    reply.cookie("refresh_token", refreshToken, {path: "/", signed: true});
    reply.cookie("access_token", accessToken, {path: "/", signed: true});
    //발급한 토큰을 저장한다
    addLoginHistory({userid: userId, ssoid, token: accessToken});
    reply.send(accessToken);
  });

  fastify.post("/refreshToken", async (req: FastifyRequest, reply: FastifyReply) => {
    const result = req.unsignCookie(req.cookies["refresh_token"] || "");
    if (!result || result.value == null) {
      return reply.code(ERROR_AUTH_TOKEN_NOTEXISTS).send("ERROR_AUTH_TOKEN_NOTEXISTS");
    }

    if (!result.valid) {
      return reply.code(ERROR_AUTH_UNVALID).send("ERROR_AUTH_UNVALID");
    }

    const refresh_token = result.value || "";
    const user = await getUserInfoByRefreshToken(refresh_token);

    if (!user) {
      return reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
    }

    try {
      const decryptStr = decrypted(refresh_token);
      const {userid, ssoid, email} = await verifyJWT(decryptStr);
      const access = await signJWT({userid, ssoid, email});
      const access_token = encrypted(access);
      reply.cookie("access_token", access_token, {path: "/", signed: true});
      addLoginHistory({userid, ssoid, token: access_token});
      return reply.send("");
    } catch (err) {
      return reply.code(ERROR_AUTH_REFRESH_EXPIRED).send("ERROR_AUTH_REFRESH_EXPIRED");
    }
  });
}
