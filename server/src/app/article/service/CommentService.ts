import {txProcess} from "@lib/db";
import Comment from "@article/entity/Comment";
import {LessThanOrEqual, Not} from "typeorm";

//FIXME: 세부 정렬 조건은 추후에...
//  그룹에서 나빼고...
export async function getCommentList(articleid: number, {take = 10, lastid, cmtid}: {take: number; lastid?: number; cmtid?: number}) {
  return await Comment.find({
    where: {articleid, refid: lastid && LessThanOrEqual(lastid), cmtid: cmtid && Not(cmtid)},
    order: {refid: "DESC", createdate: "ASC"},
    take,
  });
}

// 요청 할 때 추가
export async function addComment(comment: {articleid: number; refid?: number; comment: string; srchComment: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Comment);
    const refid = comment?.refid;
    const result = await repository.save(comment);
    const {cmtid} = result;
    if (refid == undefined) {
      await repository.update({cmtid}, {refid: cmtid});
      result.refid = cmtid;
    }
    return result;
  });
}

export async function editComment(cmtid: number, comment: {comment: string; srchComment: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Comment);
    return await repository.update({cmtid}, comment);
  });
}

export async function removeComment(cmtid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Comment);
    return await repository.delete({cmtid});
  });
}
