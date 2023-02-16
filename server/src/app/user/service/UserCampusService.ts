import {CommonYN, COMMON_Y} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import Soon from "@soon/entity/Soon";
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
  return await UserCampus.find({where: {campusid}, relations: {user: {sj: {soonwon: true}, sw: {soonjang: true}}, campus: true}});
}
export async function getCampusSJList(campusid: string) {
  const list = await UserCampus.find({where: {campusid}, relations: {user: true, campus: true}});
  const ids = list?.map(({userid}) => userid);
  if (ids?.length > 0) {
    return Soon.createQueryBuilder().select("sjid").where(`sjid IN(${ids.join()})`).groupBy("sjid").getMany();
  }
  return [];
}
