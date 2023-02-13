import {txProcess} from "@lib/db";
import BBSRequest from "@bbs/entity/BBSRequest";
import BBS from "@bbs/entity/BBS";
import {GBN_DYNAMIC} from "@bbs/BBSConstants";
import BBSRequestUser from "@bbs/entity/BBSRequestUser";

export async function getBBSRequestList() {
  return await BBSRequest.find();
}

// 요청 할 때 추가
export async function addBBSRequest(bbs: {name: string; masterid: number; description: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBSRequest);
    const gbn = GBN_DYNAMIC;
    return repository.save({...bbs, gbn});
  });
}

export async function signBBSRequest(reqbbsid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBSRequest);
    const bbsRepository = manager.getRepository(BBS);
    const bbsRequest = await repository.findOne({where: {reqbbsid}});
    let bbs = null;
    if (bbsRequest) {
      bbs = await bbsRepository.save(bbsRequest);
      await repository.delete({reqbbsid});
    }
    return bbs;
  });
}

//FIXME: 관리자가 삭제.... 컨셉상 없긴 해
export async function removeBBSRequest(reqbbsid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBSRequest);

    return repository.delete({reqbbsid});
  });
}
export async function toggleBBSRequestUser(user: {bbsid: number; userid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(BBSRequestUser);
    const _user = await repository.findOne({where: user});
    if (_user) {
      return repository.delete(user);
    } else {
      return repository.save(user);
    }
  });
}
