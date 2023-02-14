import {addUserAuth, getUserAuthInfo, getUserAuthList, removeUserAuth} from "@user/service/UserAuthService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const authes = await getUserAuthList(userid);
    reply.send(authes);
  });

  fastify.get("/:authid", async (req: FastifyRequest<{Params: {userid: number; authid: string}}>, reply: FastifyReply) => {
    const auth = await getUserAuthInfo(req.params);
    reply.send(auth);
  });

  fastify.post("/", async (req: FastifyRequest<{Params: {userid: number}; Body: {authid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const {authid} = req.body;
    const auth = await addUserAuth(userid, authid);
    reply.send(auth);
  });

  fastify.delete("/:authid", async (req: FastifyRequest<{Params: {userid: number; authid: string}}>, reply: FastifyReply) => {
    const auth = await removeUserAuth(req.params);
    reply.send(auth);
  });
}
