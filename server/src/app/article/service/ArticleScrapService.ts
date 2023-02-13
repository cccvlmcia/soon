import {txProcess} from "@lib/db";
import ArticleScrap from "@article/entity/ArticleScrap";

export async function getArticleScrapList(articleid: number) {
  return await ArticleScrap.find({where: {articleid}});
}

export async function getArticleScrapListByUserid(userid: number, articleid?: number) {
  return await ArticleScrap.find({where: {userid, articleid}});
}

// 요청 할 때 추가
export async function addArticleScrap(scrap: {userid: number; articleid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ArticleScrap);
    return repository.save(scrap);
  });
}

export async function removeArticleScrap(scrap: {userid: number; articleid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(ArticleScrap);
    return repository.delete(scrap);
  });
}
