import {FastifyInstance} from "fastify";
import article from "./article";
import bbs from "./bbs";
import campus from "./campus";
import note from "./note";
import soon from "./soon";
import user from "./user";

export default async function (fastify: FastifyInstance) {
  fastify.register(campus, {prefix: "/campus"});
  fastify.register(user, {prefix: "/user"});
  fastify.register(note, {prefix: "/:userid/note"});
  fastify.register(article, {prefix: "/article"});
  fastify.register(bbs, {prefix: "/bbs"});
  fastify.register(soon, {prefix: "/soon"});
}
