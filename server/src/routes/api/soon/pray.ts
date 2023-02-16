import {CommonYN} from "@common/CommonConstants";
import {editSoonPray, removeSoonPray} from "@soon/service/SoonPrayService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.put("/:prayid", async (req: FastifyRequest<{Params: {prayid: number}; Body: {pray: string, publicyn: CommonYN}}>, reply: FastifyReply) => {
    const {prayid} = req.params;
    console.log("prayid>>",prayid);
    const history = await editSoonPray(prayid, req.body);
    reply.send(history);
  });

  fastify.delete("/:prayid", async (req: FastifyRequest<{Params: {prayid: number}}>, reply: FastifyReply) => {
    const {prayid} = req.params;
    const history = await removeSoonPray(prayid);
    reply.send(history);
  });
}
