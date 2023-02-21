import {CommonYN, COMMON_Y} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import Soon from "@soon/entity/Soon";
import User from "@user/entity/User";
import UserCampus from "@user/entity/UserCampus";
import UserCampusRequest from "@user/entity/UserCampusRequest";
import UserConfig from "@user/entity/UserConfig";
import {In} from "typeorm";

export async function editUserCampus(userid: number, campus: {campusid: string; major: string; sid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserCampus);
    return await repository.update({userid, defaultyn: CommonYN.Y}, campus);
  });
}
export async function addUserCampus(campus: {userid: number; campusid: string; major: string; sid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserCampus);
    const reqRepository = manager.getRepository(UserCampusRequest);
    const configRepo = manager.getRepository(UserConfig);
    const config = await configRepo.findOne({where: {userid: campus?.userid}});
    if (config?.adminyn == COMMON_Y) {
      return await repository.save(campus);
    } else {
      // FIXME: 패치 전까지, req랑 실 데이터랑 둘 다 저장
      await repository.save(campus);
      return await reqRepository.save(campus);
    }
  });
}
export async function getUserCampus(userid: number) {
  return await UserCampus.find({where: {userid}, relations: {campus: true, user: true}, order: {sid: "ASC", user: {nickname: "ASC"}}});
}
export async function getCampusUser(campusid: string) {
  return await UserCampus.find({
    where: {campusid},
    relations: {user: {auth: true, sj: {soonwon: {campus: true}}, sw: {soonjang: true}}, campus: true},
    order: {sid: "ASC", user: {nickname: "ASC"}},
  });
}
export async function getCampusUserList(userid: number) {
  const result = await UserCampus.find({where: {userid}, relations: {campus: true}});
  // console.log("result : ", result[0].campus);
  const campuses = result?.map(({campus}) => campus);
  const users = await UserCampus.find({
    where: {campusid: In(campuses.map(({campusid}) => campusid))},
    relations: {user: {sw: {soonjang: true}}},
    order: {sid: "ASC", user: {nickname: "ASC"}},
  });
  return campuses.map(campus => ({
    campus,
    users: users.filter(item => item.campusid == campus.campusid).map(({user}) => user),
  }));
}
export async function getCampusSJList(campusid: string) {
  const list = await UserCampus.find({where: {campusid}, relations: {user: true, campus: true}});
  const ids = list?.map(({userid}) => userid);
  if (ids?.length > 0) {
    return Soon.createQueryBuilder().select("sjid").where(`sjid IN(${ids.join()})`).groupBy("sjid").getMany();
  }
  return [];
}
