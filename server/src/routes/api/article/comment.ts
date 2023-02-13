import {addComment, editComment, getCommentList, removeComment} from "@article/service/CommentService";
import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";

export default async function (fastify: FastifyInstance) {
  //FIXME: 정렬 필요 나중에 수정
  fastify.get(
    "/",
    async (req: FastifyRequest<{Params: {articleid: number}; Querystring: {take: number; lastid?: number; cmtid?: number}}>, reply: FastifyReply) => {
      const {articleid} = req.params;
      const comments = await getCommentList(articleid, req.query);
      reply.send(comments);
    },
  );

  fastify.post("/", async (req: FastifyRequest<{Params: {articleid: number}; Body: {refid?: number; comment: string}}>, reply: FastifyReply) => {
    const {articleid} = req.params;
    const {comment} = req.body;

    //FIXME: 검색어 처리 필요
    const srchComment = comment;
    const comments = await addComment({...req.body, articleid, srchComment});
    reply.send(comments);
  });

  fastify.put(
    "/:cmtid",
    async (req: FastifyRequest<{Params: {articleid: number; cmtid: number}; Body: {refid: number; comment: string}}>, reply: FastifyReply) => {
      const {cmtid, articleid} = req.params;
      const {comment} = req.body;
      //FIXME: 검색어 처리 필요
      const srchComment = comment;
      const comments = await editComment(cmtid, {...req.body, srchComment});
      reply.send(comments);
    },
  );
  fastify.delete("/:cmtid", async (req: FastifyRequest<{Params: {cmtid: number}}>, reply: FastifyReply) => {
    const {cmtid} = req.params;
    const comments = await removeComment(cmtid);
    reply.send(comments);
  });
}
