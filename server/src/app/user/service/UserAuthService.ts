import {txProcess} from "@lib/db";
import UserAuth from "@user/entity/UserAuth";

export async function getUserAuthList(userid: number) {
  return await UserAuth.find({where: {userid}});
}

export async function toggleUserAuth(userid: number, authid: string, campusid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserAuth);
    const auth = await repository.findOne({where: {userid, authid, campusid}});
    if (auth) {
      return await repository.delete({userid, authid, campusid});
    } else {
      return await repository.save({userid, authid, campusid});
    }
  });
}
