import {addArticle, editArticle, getArticleBestList, getArticleInfo, removeArticle} from "@article/service/ArticleService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
import comment from "./comment";

export default async function (fastify: FastifyInstance) {
  fastify.register(comment, {prefix: "/:articleid/comments"});

  fastify.get("/best", async (req: FastifyRequest, reply: FastifyReply) => {
    const articles = await getArticleBestList();
    reply.send(articles);
  });
  fastify.get("/:articleid", async (req: FastifyRequest<{Params: {articleid: number}}>, reply: FastifyReply) => {
    const {articleid} = req.params;
    const articles = await getArticleInfo(articleid);
    reply.send(articles);
  });

  //TODO: 처리가 복잡해서 나중에 정신차리고 한다.
  fastify.post("/", async (req: FastifyRequest<{Body: {bbsid: number; userid: number; title: string; contents: string}}>, reply: FastifyReply) => {
    const thumbnail = " 이미지 받아서 압축하는 처리";
    const srchContents = "contents에 적용된 태그를 벗겨내고 저장";
    const selected = await addArticle({...req.body, thumbnail, srchContents});
    reply.send(selected);
  });

  //TODO: 처리가 복잡해서 나중에 정신차리고 한다.
  fastify.put(
    "/:articleid",
    async (
      req: FastifyRequest<{Params: {articleid: number}; Body: {bbsid: number; userid: number; title: string; contents: string}}>,
      reply: FastifyReply,
    ) => {
      const {articleid} = req.params;

      const thumbnail = " 이미지 받아서 압축하는 처리";
      const srchContents = "contents에 적용된 태그를 벗겨내고 저장";
      const selected = await editArticle(articleid, {...req.body, thumbnail, srchContents});
      reply.send(selected);
    },
  );

  fastify.delete("/:articleid", async (req: FastifyRequest<{Params: {articleid: number}}>, reply: FastifyReply) => {
    const {articleid} = req.params;
    const selected = await removeArticle(articleid);
    reply.send(selected);
  });
}
