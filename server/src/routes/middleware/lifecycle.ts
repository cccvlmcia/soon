import {FastifyReply} from "fastify";
import {FastifyInstance, FastifyRequest} from "fastify";
import {apiLogger as logger} from "@config/winston.config";
import {xssFilter} from "@utils/StringUtils";
import {ERROR_AUTH_EXPIRED, ERROR_AUTH_MALFORMED, ERROR_AUTH_NOTEXISTS, ERROR_AUTH_UNVALID} from "@error/AuthCode";
import {decrypted} from "@utils/CipherUtils";
import {verifyJWT} from "@utils/OAuth2Utils";
import {EXCEPT_URL} from "@config/haqqaton.config";

export default function (fastify: FastifyInstance) {
  //1. preValidation : xxsFilter
  fastify.addHook("preValidation", async (req: FastifyRequest, _: FastifyReply) => {
    const body: any = req.body;
    const result: any = {};
    for (const key in body) {
      result[key] = xssFilter(body[key]);
    }
    req.body = result;
  });

  //2. preValidation : token_validation
  type jwt = {
    userid: number;
    email: string;
    iat: number;
    exp: number;
  };
  fastify.addHook("preValidation", async (req: FastifyRequest<{Body: {jwt: jwt}}>, reply: FastifyReply) => {
    const result = req.unsignCookie(req.cookies["access_token"] || "");
    if (result?.value == null) {
      return true;
    } else if (result.valid) {
      const _token = result.value || "";
      if (_token) {
        const decryptStr = decrypted(_token);
        try {
          const jwt: jwt = await verifyJWT(decryptStr);
          req.body = {...req.body, jwt};
          return true;
        } catch (err: any) {
          console.error(err);
          console.log("EXCEPT_URL >", EXCEPT_URL, req.url);
          const isExcept = EXCEPT_URL.filter(url => req.url?.startsWith(url))?.length > 0;
          if (!isExcept) {
            if (err.message == "jwt expired") {
              //얘만 /auth/refreshToken 호출
              reply.code(ERROR_AUTH_EXPIRED).send("ERROR_AUTH_EXPIRED");
            } else if (err.message == "jwt malformed" || err.message == "invalid signature") {
              // 로그인으로 가야함.
              reply.code(ERROR_AUTH_MALFORMED).send("ERROR_AUTH_MALFORMED");
            }
          }
        }
      } else {
        // 로그인으로 가야함.
        reply.code(ERROR_AUTH_NOTEXISTS).send("ERROR_AUTH_NOTEXISTS");
      }
    } else {
      // 로그인으로 가야함.
      reply.code(ERROR_AUTH_UNVALID).send("ERROR_AUTH_UNVALID");
    }
  });

  fastify.addHook("onSend", async (req: FastifyRequest, reply: FastifyReply, _) => {
    const ip = req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];
    const url = req.url;
    const isNotStatic = false;
    const isNotHealthCheck = userAgent != "ELB-HealthChecker/2.0";
    if (reply.statusCode >= 400) {
      logger.error(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    } else if (isNotHealthCheck && isNotStatic) {
      logger.info(`${ip} ${req.method} ${req.protocol}://${req.hostname}${url} ${reply.statusCode} ${userAgent}`);
    }
  });
}
