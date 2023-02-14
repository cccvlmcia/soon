import {txProcess} from "@lib/db";
import UserAuth from "@user/entity/UserAuth";

export async function getUserAuthList(userid: number) {
  return await UserAuth.find({where: {userid}});
}

export async function getUserAuthInfo(auth: {authid: string; userid: number}) {
  return await UserAuth.findOne({where: auth});
}

export async function toggleUserAuth(userid: number, authid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAuth);
    const auth = await repository.findOne({where: {userid, authid}});
    if (auth) {
      return await repository.delete({userid, authid});
    } else {
      return await repository.save({userid, authid});
    }
  });
}
export async function removeUserAuth(auth: {authid: string; userid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAuth);
    return await repository.delete(auth);
  });
}
