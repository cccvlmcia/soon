import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import {
  addSoonHistory,
  getSoonHistorySJList,
  getSoonHistorySJListNotMe,
  getSoonHistorySWList,
  removeSoonHistory,
} from "@soon/service/SoonHistoryService";
import {getUserCampus} from "@user/service/UserCampusService";
import {authHandler} from "@utils/OAuth2Utils";
import {AUTH} from "@auth/AuthConstants";

type jwt = {
  userid: number;
  email: string;
  iat: number;
  exp: number;
};

export default async function (fastify: FastifyInstance) {
  //TODO: 권한 있을 때, 권한 없을 때 (campus 조회 권한)
  fastify.get("/sj/:sjid", {
    preHandler: authHandler([AUTH.USER]),
    handler: async (req: FastifyRequest<{Params: {sjid: number}; Body: {jwt: jwt}}>, reply: FastifyReply) => {
      const {sjid} = req.params;
      const {jwt} = req.body;
      const userid = jwt.userid;
      let histories = null;
      if (sjid == userid) {
        histories = await getSoonHistorySJList(sjid);
      } else {
        const userCampus = await getUserCampus(sjid);
        const campues = userCampus?.map(({campus}) => campus.campusid);
        histories = await getSoonHistorySJListNotMe(sjid, campues);
      }
      reply.send(histories);
    },
  });

  fastify.get("/sw/:swid", async (req: FastifyRequest<{Params: {swid: number}}>, reply: FastifyReply) => {
    const {swid} = req.params;
    const histories = await getSoonHistorySWList(swid);
    reply.send(histories);
  });

  fastify.post(
    "/",
    async (
      req: FastifyRequest<{
        Body: {
          userid?: number;
          sjid: number;
          swid: number;
          kind: string;
          progress: string;
          historydate: Date;
          contents?: string;
          prays?: {
            pray: string;
            publicyn: string;
          }[];
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {data}: any = req.body;
      console.log("data >>", data);
      const history = await addSoonHistory(data);
      reply.send(history);
    },
  );

  fastify.delete("/:historyid", async (req: FastifyRequest<{Params: {historyid: number}}>, reply: FastifyReply) => {
    const {historyid} = req.params;
    const history = await removeSoonHistory(historyid);
    reply.send(history);
  });
}
