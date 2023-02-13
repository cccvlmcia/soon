import {FastifyInstance, FastifyRequest, FastifyReply} from "fastify";
import fs from "fs";
import path from "path";
import {format} from "date-fns";
import {pipeline} from "stream";
import util from "util";
import {generatedUUID} from "@utils/UUIDUtils";
import {addTempFile, removeTempFile} from "@file/service/FileTempService";
import {getMetaFile} from "@file/service/FileMetaService";
const pump = util.promisify(pipeline);

export default async function (fastify: FastifyInstance) {
  fastify.get("/:fileid", async (req: FastifyRequest<{Params: {fileid: string}}>, reply: FastifyReply) => {
    const {fileid} = req.params;
    const result = await getMetaFile(fileid);
    if (result) {
      const ext = result.mimetype.split("/")[1];
      const filepath = `${result?.filepath}/${fileid}`;
      const absolutepath = path.join(__dirname, "../../../../") + filepath;
      const filename = encodeURI(result.filename);
      const file = fs.readFileSync(absolutepath);
      reply.headers({
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Transfer-Encoding": `binary`,
        "Content-Type": `application/octet-stream`,
      });
      reply.send(file);
    } else {
      reply.send(result);
    }
  });

  // TEMP > 데이터 저장 > 게시글 작성시 META 폴더 및 DB로 데이터 복사
  fastify.post("/", async (req: FastifyRequest<{Body: {filetype: any; file: any; reftype: any}}>, reply: FastifyReply) => {
    const filetype = req.body.filetype.value;
    const parts = req.body.file;
    const reftype = req.body.reftype.value;
    const isMulti = req.body.file?.length ? true : false;
    const fileresult = [];
    let sortno = 1;
    if (isMulti) {
      for (const part of parts) {
        const fileid = await makefile(part, filetype, sortno++, reftype);
        fileresult.push(fileid);
      }
    } else {
      const filedata = await makefile(parts, filetype, 1, reftype);
      fileresult.push(filedata);
    }
    reply.send({files: fileresult, filetype});
  });

  fastify.delete("/:fileid", async (req: FastifyRequest<{Params: {fileid: string}}>, reply: FastifyReply) => {
    const {fileid} = req.params;
    const result = await removeTempFile(fileid);
    reply.send(result);
  });

  async function makefile(part: any, filetype: string, sortno: number, reftype: string) {
    const mimetype = part.mimetype;
    const filename = part.filename;
    const fileid = generatedUUID();
    const img_root = "public/temp";
    const filepath = img_root + "/" + format(new Date(), "yyyy/MM/dd/HH");
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, {recursive: true});
    }
    const filesize = part.file.bytesRead;
    await addTempFile(fileid, filename, filepath, filesize, mimetype, filetype, sortno, reftype);
    // 확장자 없이 저장 + 파일 중복을 피하기 위해 fileid로 저장
    const newfilepath = filepath + "/" + fileid;
    // read&write file
    await pump(part.file, fs.createWriteStream(newfilepath));
    // file buffer
    fs.writeFileSync(newfilepath, await part.toBuffer());
    return {fileid, filename, filepath: newfilepath};
  }

  /*
  fastify.get("/:refid/uploadlist", async (req: FastifyRequest<{Params: {refid: number}}>, reply: FastifyReply) => {
    const {refid} = req.params;
    const reftype = "UPLOAD";
    const result = await getDownloadFiles(reftype, refid);
    reply.send(result);
  });
  */
}
