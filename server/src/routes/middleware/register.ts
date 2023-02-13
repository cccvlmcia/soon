import statics from "@fastify/static";
import formbody from "@fastify/formbody";
import cors, {FastifyCorsOptions} from "@fastify/cors";
import fastifyView from "@fastify/view";
import path from "path";
import ejs from "ejs";
import cookie from "@fastify/cookie";
// import session from "@fastify/session";
import {FastifyInstance} from "fastify";
import oauth2 from "@fastify/oauth2";
import {googleAuth, kakaoAuth} from "@config/auth.config";
import {haqqaton} from "@config/haqqaton.config";

export default async function (fastify: FastifyInstance) {
  /* FormBody */
  fastify.register(formbody);

  /* COOKIE */
  // fastify.register(cookie);
  fastify.register(cookie, {
    secret: haqqaton?.token?.secret, // for cookies signature

    //   hook: "preHandler", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
    //FIXME: 추후에 동일한 도메인으로 수정하고, sameSite 삭제 할 것
    parseOptions: {httpOnly: true, sameSite: "none", secure: true}, // options for parsing cookies
  });

  /* VIEWS */
  // view engine 정의
  // fastify.register(pointOfView, {engine: {ejs}});
  fastify.register(fastifyView, {engine: {ejs}});
  /* STATIC */
  // fastify.register(statics, {root: path.join(__dirname, "../../../dist/assets"), prefix: "/assets/", decorateReply: false});
  fastify.register(statics, {root: path.join(__dirname, "../../../public"), prefix: "/public/", decorateReply: false});
  fastify.register(statics, {
    root: path.join(__dirname, "../../../node_modules"),
    prefix: "/node_modules/",
    decorateReply: false,
  });

  /* CORS */
  fastify.register(cors, (_: any) => {
    return (_: any, callback: (error: Error | null, options: FastifyCorsOptions) => void) => {
      let corsOption: FastifyCorsOptions = {origin: true, credentials: true};
      return callback(null, corsOption);
    };
  });

  fastify.register(oauth2, googleAuth);
  fastify.register(oauth2, kakaoAuth);
  // auth(fastify);
}
