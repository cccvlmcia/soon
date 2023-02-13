import {addNote, editNoteReadYn, getNoteList, removeNote} from "@note/service/NoteService";
import {FastifyReply, FastifyInstance, FastifyRequest} from "fastify";
export default async function (fastify: FastifyInstance) {
  //FIXME: 일단 보류 없을수도?
  fastify.get("/", async (req: FastifyRequest<{Params: {userid: number}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const receiveid = userid;
    const notes = await getNoteList(receiveid);
    reply.send(notes);
  });

  // name: string; masterid: number; gbn: string
  fastify.post("/", async (req: FastifyRequest<{Params: {userid: number}; Body: {refid: number; contents: string}}>, reply: FastifyReply) => {
    const {userid} = req.params;
    const selected = await addNote({userid, ...req.body});
    reply.send(selected);
  });

  //receiverid 인지 검증 필요
  fastify.delete("/:noteid", async (req: FastifyRequest<{Params: {noteid: number}}>, reply: FastifyReply) => {
    const {noteid} = req.params;
    const result = await removeNote(noteid);
    reply.send(result);
  });

  //receiverid 인지 검증 필요
  fastify.put("/:noteid", async (req: FastifyRequest<{Params: {noteid: number}}>, reply: FastifyReply) => {
    const {noteid} = req.params;
    const result = await editNoteReadYn(noteid);
    reply.send(result);
  });
}
