import {addBBSRequest, signBBSRequest, toggleBBSRequestUser} from "@bbs/service/BBSRequestService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post("/", async (req: FastifyRequest<{Body: {name: string; masterid: number; description: string}}>, reply: FastifyReply) => {
    const bbs = await addBBSRequest(req.body);
    reply.send(bbs);
  });

  fastify.post("/:bbsid/sign", async (req: FastifyRequest<{Params: {bbsid: number}}>, reply: FastifyReply) => {
    const {bbsid} = req.params;
    const bbs = await signBBSRequest(bbsid);
    reply.send(bbs);
  });
  fastify.post("/:bbsid/user/:userid", async (req: FastifyRequest<{Params: {bbsid: number; userid: number}}>, reply: FastifyReply) => {
    const {bbsid, userid} = req.params;
    const user = await toggleBBSRequestUser({bbsid, userid});
    reply.send(user);
  });
}
