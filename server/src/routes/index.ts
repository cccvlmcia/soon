import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import api from "@routes/api";
import pages from "./pages";
import auth from "./auth";
import file from "./file";
import {authHandler} from "@utils/OAuth2Utils";

export default async function (fastify: FastifyInstance) {
  //api
  fastify.register(api, {prefix: "/api/v1"});

  fastify.register(file, {prefix: "/file"});
  fastify.register(auth, {prefix: "/auth"});

  fastify.register(pages, {prefix: "/"});

  type jwt = {
    userid: number;
    email: string;
    iat: number;
    exp: number;
  };
}
