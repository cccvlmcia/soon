import {CommonYN} from "@common/CommonConstants";
import {editSoonPrayPublicYn, removeSoonPray} from "@soon/service/SoonPrayService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.put("/", async (req: FastifyRequest<{Params: {prayid: number}; Body: {publicyn: CommonYN}}>, reply: FastifyReply) => {
    const {prayid} = req.params;
    const history = await editSoonPrayPublicYn(prayid, req.body);
    reply.send(history);
  });

  fastify.delete("/:prayid", async (req: FastifyRequest<{Params: {prayid: number}}>, reply: FastifyReply) => {
    const {prayid} = req.params;
    const history = await removeSoonPray(prayid);
    reply.send(history);
  });
}
