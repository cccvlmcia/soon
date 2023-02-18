import {toggleUserAuth} from "@user/service/UserAuthService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  /*
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const authes = await getUserAuthList(userid);
    reply.send(authes);
  });
*/
  fastify.post("/", async (req: FastifyRequest<{Params: {userid: number}; Body: {authid: string; campusid: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const {authid, campusid} = req.body;
    const auth = await toggleUserAuth(userid, authid, campusid);
    reply.send(auth);
  });
}
