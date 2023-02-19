import {CommonYN} from "@common/CommonConstants";
import {addUserCampus} from "@user/service/UserCampusService";
import {addUserLogin, removeUserLogin} from "@user/service/UserLoginService";
import {addUser, editUser, getUserInfo, getUserList, removeUser} from "@user/service/UserService";
import {Gender} from "@user/UserConstants";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import userArticle from "./article";
import userAuth from "./auth";

export default async function (fastify: FastifyInstance) {
  fastify.register(userArticle, {prefix: "/:userid/article/:articleid"});
  fastify.register(userAuth, {prefix: "/:userid/auth"});
  fastify.post(
    "/:userid/campus",
    async (req: FastifyRequest<{Params: {userid: number}; Body: {campusid: string; major: string; sid: number}}>, reply: FastifyReply) => {
      const {userid} = req.params;
      const user = await addUserCampus({userid, ...req.body});
      reply.send(user);
    },
  );

  //FIXME: 사용자 목록... 처리 방안 필요
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await getUserList();
    reply.send(users);
  });

  fastify.get("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const users = await getUserInfo(userid);
    reply.send(users);
  });

  // name: string; masterid: number; gbn: string
  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          nickname: string;
          gender: Gender;
          cccyn: CommonYN;
          campusid: string;
          major: string;
          sid: number;
          ssoid: string;
          email: string;
          type: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const selected = await addUser(req.body);
      reply.send(selected);
    },
  );
  fastify.put(
    "/:userid",
    async (
      req: FastifyRequest<{
        Params: {userid: number};
        Body: {
          nickname: string;
          gender: Gender;
          cccyn: CommonYN;
          campusid: string;
          major: string;
          sid: number;
          ssoid: string;
          email: string;
          type: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {userid} = req.params;
      console.log("userid, req.body >>>>", userid, req.body);
      const selected = await editUser(userid, req.body);
      reply.send(selected);
    },
  );

  //계정에 대한 SSO 연동
  fastify.post(
    "/:userid/login",
    async (req: FastifyRequest<{Params: {userid: number}; Body: {ssoid: string; email: string; type: string}}>, reply: FastifyReply) => {
      const {userid} = req.params;
      const user = await addUserLogin(userid, req.body);
      reply.send(user);
    },
  );
  fastify.delete("/:userid/login/:ssoid", async (req: FastifyRequest<{Params: {userid: number; ssoid: string}}>, reply: FastifyReply) => {
    const {userid, ssoid} = req.params;
    const articles = await removeUserLogin({userid, ssoid});
    reply.send(articles);
  });

  //실제 삭제하지 않고, edit status
  fastify.delete("/:userid", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const articles = await removeUser(userid);
    reply.send(articles);
  });
}
