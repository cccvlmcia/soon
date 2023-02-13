import {txProcess} from "@lib/db";
import ArticleLike from "@article/entity/ArticleLike";

export async function getArticleLikeList(articleid: number) {
  return await ArticleLike.find({where: {articleid}});
}

export async function getArticleLikeListByUserid(userid: number, articleid?: number) {
  return await ArticleLike.find({where: {userid, articleid}});
}

// 요청 할 때 추가
export async function addArticleLike(like: {userid: number; articleid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ArticleLike);
    return repository.save(like);
  });
}

export async function removeArticleLike(like: {userid: number; articleid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ArticleLike);
    return repository.delete(like);
  });
}
