import {Jwt} from "jsonwebtoken";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import {
  addSoonHistory,
  getSoonHistory,
  getSoonHistorySJList,
  getSoonHistorySJListNotMe,
  getSoonHistorySWList,
  removeSoonHistory,
  editSoonHistory,
} from "@soon/service/SoonHistoryService";
import {getUserCampus} from "@user/service/UserCampusService";
import {authHandler} from "@utils/OAuth2Utils";
import {AUTH} from "@auth/AuthConstants";
import Soon from "@soon/entity/Soon";
import {SoonType} from "@soon/SoonConstants";
import {addBatchSoonHistory} from "@soon/service/SoonPrayService";
import {CommonYN} from "@common/CommonConstants";

type jwt = {
  userid: number;
  email: string;
  iat: number;
  exp: number;
};

export default async function (fastify: FastifyInstance) {
  fastify.get("/:historyid", async (req: FastifyRequest<{Params: {historyid: number}}>, reply: FastifyReply) => {
    const {historyid} = req.params;

    const histories = await getSoonHistory(historyid);
    console.log("histories >>", histories);
    reply.send(histories);
  });

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
          swids: number[];
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
      const history = await addSoonHistory(req.body);
      reply.send(history);
    },
  );

  fastify.put(
    "/:historyid",
    async (
      req: FastifyRequest<{
        Params: {historyid: number};
        Body: {
          userid?: number;
          sjid: number;
          kind: SoonType;
          progress: string;
          historydate: Date;
          contents?: string;
        };
      }>,
      reply: FastifyReply,
    ) => {
      const {historyid} = req.params;
      console.log("req.body : ", req.body);
      const history = await editSoonHistory(historyid, req.body);
      reply.send(history);
    },
  );

  fastify.delete("/:historyid", async (req: FastifyRequest<{Params: {historyid: number}}>, reply: FastifyReply) => {
    const {historyid} = req.params;
    const history = await removeSoonHistory(historyid);
    reply.send(history);
  });
  fastify.post(
    "/:historyid/pray",
    async (req: FastifyRequest<{Params: {historyid: number}; Body: {prays: {pray: string; publicyn: CommonYN}[]}}>, reply: FastifyReply) => {
      const {historyid} = req.params;
      const {prays} = req.body;
      const prayList = prays?.map((item: {pray: string; publicyn: string}) => ({...item, historyid}));
      const result = await addBatchSoonHistory(prayList);
      reply.send(result);
    },
  );
}
