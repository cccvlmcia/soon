import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import {addSoon, getSoonInfo, getSoonList, removeSoon, getSoonId} from "@soon/service/SoonService";
import history from "./history";
import pray from "./pray";

export default async function (fastify: FastifyInstance) {
  fastify.register(history, {prefix: "/history"});
  fastify.register(pray, {prefix: "/pray"});

  //TODO: 권한 있을 때, 권한 없을 때 (campus 조회 권한)
  fastify.get("/sj/:sjid", async (req: FastifyRequest<{Params: {sjid: number}}>, reply: FastifyReply) => {
    const {sjid} = req.params;
    const soons = await getSoonList(sjid);
    reply.send(soons);
  });

  fastify.get("/sw/:swid", async (req: FastifyRequest<{Params: {swid: number}}>, reply: FastifyReply) => {
    const {swid} = req.params;
    const soon = await getSoonInfo(swid);
    reply.send(soon);
  });
 // 순 Id 가져오는 용도
  fastify.get("/:sjid/:swid",async (req: FastifyRequest<{Params: {sjid:number, swid: number}}>, reply: FastifyReply) => {
    const{sjid, swid} = req.params;
    const soonId = await getSoonId(sjid, swid);
    reply.send(soonId);
  });

  fastify.post("/", async (req: FastifyRequest<{Body: {sjid: number; swid: number}}>, reply: FastifyReply) => {
    const soon = await addSoon(req.body);
    reply.send(soon);
  });

  fastify.delete("/:soonid", async (req: FastifyRequest<{Params: {soonid: number}}>, reply: FastifyReply) => {
    const {soonid} = req.params;
    const soon = await removeSoon(soonid);
    reply.send(soon);
  });
}
