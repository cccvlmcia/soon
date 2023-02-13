import {COMMON_Y} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import Note from "@note/entity/Note";

export async function getNoteList(userid: number) {
  return await Note.find({where: {userid}}); //생긴지 1주일 이내만?
}
export async function addNote(note: {userid: number; refid: number; contents: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Note);
    return await repository.save(note);
  });
}
export async function removeNote(noteid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Note);
    return await repository.delete({noteid});
  });
}
export async function editNoteReadYn(noteid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Note);
    return await repository.update({noteid}, {readyn: COMMON_Y});
  });
}
