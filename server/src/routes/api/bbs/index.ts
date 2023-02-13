import {getArticleList} from "@article/service/ArticleService";
import {addBBS, getBBSList, removeBBS} from "@bbs/service/BBSService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import request from "./request";
export default async function (fastify: FastifyInstance) {
  fastify.register(request, {prefix: "/request"});

  //FIXME: 일단 보류 없을수도?
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const selected = await getBBSList();
    reply.send(selected);
  });

  // name: string; masterid: number; gbn: string
  fastify.post("/", async (req: FastifyRequest<{Body: {name: string; masterid: number; gbn: string}}>, reply: FastifyReply) => {
    const selected = await addBBS(req.body);
    reply.send(selected);
  });

  fastify.delete("/:bbsid", async (req: FastifyRequest<{Params: {bbsid: number}}>, reply: FastifyReply) => {
    const {bbsid} = req.params;
    const selected = await removeBBS(bbsid);
    reply.send(selected);
  });

  fastify.get(
    "/:bbsid/articles",
    async (req: FastifyRequest<{Params: {bbsid: number}; Querystring: {take: number; lastid: number; text: string}}>, reply: FastifyReply) => {
      const {bbsid} = req.params;
      const articles = await getArticleList(bbsid, req.query);
      reply.send(articles);
    },
  );
}
