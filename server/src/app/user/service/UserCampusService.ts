import {CommonYN, COMMON_Y} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import UserCampus from "@user/entity/UserCampus";

export async function editUserCampus(userid: number, campus: {campusid: string; major: string; sid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserCampus);
    return await repository.update({userid, defaultyn: CommonYN.Y}, campus);
  });
}
export async function getUserCampus(userid: number) {
  return await UserCampus.find({where: {userid}, relations: {campus: true}});
}
export async function getCampusUser(campusid: string) {
  return await UserCampus.find({where: {campusid}, relations: {user: true, campus: true}});
}



