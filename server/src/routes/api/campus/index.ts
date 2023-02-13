import {getCampusList} from "@campus/service/CampusService";
import { getCampusUser } from "@user/service/UserCampusService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
export default async function (fastify: FastifyInstance) {
  //캠퍼스 전체 조회 말고 검색으로?만 조회?
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const campus = await getCampusList();
    reply.send(campus);
  });
// 해당 캠퍼스 유저들 정보 가져 옴
  fastify.get("/:campusid", async (req: FastifyRequest<{Params: {campusid: string}}>, reply: FastifyReply) => {
    const {campusid} = req.params;
    const campusUser = await getCampusUser(campusid);
    reply.send(campusUser);
  });
}
