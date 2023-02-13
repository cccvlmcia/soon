import {addArticleLike, getArticleLikeListByUserid, removeArticleLike} from "@article/service/ArticleLikeService";
import {addArticleScrap, getArticleScrapListByUserid, removeArticleScrap} from "@article/service/ArticleScrapService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.post("/like", async (req: FastifyRequest<{Params: {articleid: number; userid: number}}>, reply: FastifyReply) => {
    const {articleid, userid} = req.params;
    const like = await getArticleLikeListByUserid(userid, articleid);
    let result = {status: "added", data: null};
    if (like) {
      const data = await removeArticleLike({userid, articleid});
      result.status = "removed";
      result.data = data;
    } else {
      const data = await addArticleLike({userid, articleid});
      result.status = "added";
      result.data = data;
    }
    reply.send(result);
  });

  fastify.post("/scrap", async (req: FastifyRequest<{Params: {articleid: number; userid: number}}>, reply: FastifyReply) => {
    const {articleid, userid} = req.params;
    const like = await getArticleScrapListByUserid(userid, articleid);
    let result = {status: "added", data: null};
    if (like) {
      const data = await removeArticleScrap({userid, articleid});
      result.status = "removed";
      result.data = data;
    } else {
      const data = await addArticleScrap({userid, articleid});
      result.status = "added";
      result.data = data;
    }
    reply.send(result);
  });
}
