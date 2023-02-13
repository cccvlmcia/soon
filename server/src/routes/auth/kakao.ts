import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import {haqqaton, SERVER_URI} from "@config/haqqaton.config";
import axios from "axios";
import {checkSSO} from "@utils/OAuth2Utils";
import {LOGIN_TYPE} from "@user/UserConstants";

const auth = haqqaton.oauth.kakao;
const redirectUri = `${SERVER_URI}${auth.redirectUri}`;
export default async function (fastify: FastifyInstance) {
  fastify.get("/callback", async (req: FastifyRequest<{Querystring: {code: string}}>, reply: FastifyReply) => {
    console.log("req.query >>", req.query);
    try {
      // const {access_token, refresh_token} = await kakaoOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      // const {data} = await axios.get("https://kapi.kakao.com/v2/user/me", {headers: {Authorization: `Bearer ${access_token}`}});
      const data: any = await kakaoOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
      console.log("data >>", data);
      const ssoid = data.id;
      const email = data.kakao_account?.email;
      const nickname = data?.kakao_account?.profile?.nickname;

      const login = await checkSSO(LOGIN_TYPE.KAKAO, ssoid, {nickname, email});
      reply.send(login);
    } catch (error: any) {
      console.log("error: ", error.response.data);
    }
  });
}
const kakaoOAuth2 = {
  async getAccessTokenFromAuthorizationCodeFlow(req: FastifyRequest<{Querystring: {code: string}}>) {
    const {code} = req.query;

    const oauth = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code", //특정 스트링
        client_id: auth.clientId,
        client_secret: auth.clientSecret,
        redirectUri,
        code,
      },
      {headers: {"content-type": "application/x-www-form-urlencoded"}},
    );
    const {access_token, refresh_token} = oauth.data;
    const {data} = await axios.get("https://kapi.kakao.com/v2/user/me", {headers: {Authorization: `Bearer ${access_token}`}});

    return {access_token, refresh_token, ...data};
  },
};
