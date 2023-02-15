import Fastify, {FastifyInstance} from "fastify";
import {initDatasource} from "@lib/db";
import middleware from "@routes/middleware/loader";
import routes from "@routes/index";

import {apiLogger as logger} from "@config/winston.config";
import {Server, IncomingMessage, ServerResponse} from "http";

const PORT: number = Number(process.env.PORT) || 4000;
const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify();

middleware(fastify);

routes(fastify);

async function start() {
  try {
    await initDatasource();

    //https://stackoverflow.com/questions/14043926/node-js-connect-only-works-on-localhost
    await fastify.listen({port: PORT, host: "0.0.0.0"});
    console.log(`server start! http://127.0.0.1:${PORT}/`);
  } catch (err: any) {
    logger.error(`server loading error... ${err}`);
    process.exit(1);
  }
}
start();

/*
 1. 서버 인스턴스 생성
 2. listen
 3. initDB
 4. middleware
      -  register
      -  lifecycle
 5. routes
      - api
      - view {ejs}
 6. log
 7.
  app/user/entity/User.ts
  app/user/entity/UserConfig.ts

  app/user/service/UserService.ts
    get*Info
    get*List
    add(txProcess)
      - user
      - userConfig
      edit(txProcess)
      - user
      - userConfig

  routes/api/user/index.ts
      GET
      POST
      PUT
      DELETE
 */
