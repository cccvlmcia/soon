import {txProcess} from "@lib/db";
import Article from "@article/entity/Article";
import {LessThan, Like} from "typeorm";
import {addArticleThumbnail} from "@utils/FileUtils";
import {getTempFile} from "@file/service/FileTempService";

//FIXME: 세부 정렬 조건은 추후에...
//컨셉: 마지막 + 10개
export async function getArticleList(bbsid: number, {take = 10, lastid, text}: {take: number; lastid?: number; text?: string}) {
  return await Article.find({
    where: [
      {bbsid, articleid: lastid && LessThan(lastid), srchContents: text && Like(`%${text}%`)},
      {bbsid, articleid: lastid && LessThan(lastid), user: {nickname: text && Like(`%${text}%`)}},
    ],
    relations: {bbs: true, user: true},
    order: {articleid: "DESC"},
    take,
  });
}
// like 수 많은 순서? readyn 많은 순서?
export async function getArticleBestList() {
  const take = 10;
  return await Article.find({relations: {bbs: true, user: true}, order: {articleid: "DESC"}, take});
}

export async function getArticleInfo(articleid: number) {
  return await Article.findOne({where: {articleid}});
}

// 요청 할 때 추가
export async function addArticle(article: {
  bbsid: number;
  userid: number;
  title: string;
  contents: string;
  srchContents: string;
  thumbnail?: string;
  fileids?: string[];
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Article);
    /*
    TODO:
      1. files 존재여부 확인
      2. files[0] 파일 가져와서 이미지 압축하기
      3. 압축한 이미지 thumbnail로 저장하기(fileid)
    */
    const result = await repository.save(article);
    const articleid = result.articleid;
    const fileids = article?.fileids;
    if (fileids?.length) {
      const imgFile = await getTempFile(fileids[0]);
      if (imgFile) {
        const thumb = await addArticleThumbnail(imgFile.filename, imgFile.filepath, articleid);
        article.thumbnail = thumb?.fileid;

        await repository.update({articleid}, {thumbnail: thumb.fileid});
      }
    }
    return result;
  });
}
export async function addBatchArticle(
  articles: {
    bbsid: number;
    userid: number;
    thumbnail?: string;
    title: string;
    contents: string;
    srchContents: string;
  }[],
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Article);
    return repository.save(articles);
  });
}

export async function editArticle(
  articleid: number,
  article: {bbsid: number; userid: number; thumbnail?: string; title: string; contents: string; srchContents: string},
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Article);
    return repository.update({articleid}, article);
  });
}

export async function removeArticle(articleid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Article);

    return repository.delete({articleid});
  });
}
