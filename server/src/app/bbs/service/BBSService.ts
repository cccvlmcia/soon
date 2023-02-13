import {txProcess} from "@lib/db";
import BBS from "@bbs/entity/BBS";

//FIXME: 조건 쿼리로 조회
export async function getBBSList() {
  return await BBS.find();
}
//FIXME: 아마 없을 듯?
export async function getBBSInfo(bbsid: number) {
  return await BBS.findOne({where: {bbsid}});
}

//FIXME: 관리자가 수동으로 추가하는 게시판
export async function addBBS(bbs: {name: string; masterid: number; gbn: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBS);
    return await repository.save(bbs);
  });
}

//FIXME: 게시판 이름 수정... 관리자 수정... 컨셉에 없긴해
export async function editBBS(bbsid: number, bbs: {name: string; masterid: number; gbn: string; sortno: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBS);
    return await repository.update({bbsid}, bbs);
  });
}

//FIXME: 관리자가 삭제.... 컨셉상 없긴 해
export async function removeBBS(bbsid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBS);
    return await repository.delete({bbsid});
  });
}
