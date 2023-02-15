import {CommonYN} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import UserConfig from "@user/entity/UserConfig";
import UserCampus from "@user/entity/UserCampus";
import {Gender} from "@user/UserConstants";
import UserLogin from "@user/entity/UserLogin";
import {setAuthAdmin} from "@utils/AuthUtils";
import UserAuth from "@user/entity/UserAuth";
import UserHistory from "@user/entity/UserHistory";
import Soon from "@soon/entity/Soon";
import SoonHistory from "@soon/entity/SoonHistory";
import pray from "@routes/api/soon/pray";

export async function getUserList() {
  return await User.find({relations: {campus: true, login: true, config: true}});
}

export async function getUserInfoByRefreshToken(refresh_token: string) {
  return await User.findOne({where: {refresh_token}});
}

export async function getUserInfo(userid: number) {
  return await User.findOne({where: {userid}, relations: {campus: {campus: true}, login: true, config: true, auth: true}});
}

export async function addUser({
  nickname,
  gender,
  cccyn,
  campusid,
  major,
  sid,
  ssoid,
  email,
  type,
}: {
  nickname: string;
  gender: Gender;
  cccyn: CommonYN;
  campusid: string;
  major: string;
  sid: number;
  ssoid: string;
  email: string;
  type: string;
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const loginRepository = manager.getRepository(UserLogin);
    const campusRepository = manager.getRepository(UserCampus);
    const user = await repository.save({nickname, gender});
    const userid = user.userid;
    await loginRepository.save({userid, ssoid, email, type});
    const config = await setAuthAdmin(manager, userid, email, {cccyn});
    const campus = await campusRepository.save({userid, campusid, major, sid});
    user.config = config;
    user.campus = campus;
    return user;
  });
}
export async function editUser(
  userid: number,
  {
    nickname,
    gender,
    cccyn,
    campusid,
    major,
    sid,
    ssoid,
    email,
    type,
  }: {
    nickname: string;
    gender: Gender;
    cccyn: CommonYN;
    campusid: string;
    major: string;
    sid: number;
    ssoid?: string;
    email?: string;
    type?: string;
  },
) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const loginRepository = manager.getRepository(UserLogin);
    const confRepository = manager.getRepository(UserConfig);
    const campusRepository = manager.getRepository(UserCampus);
    if (ssoid || email || type) {
      await loginRepository.update({userid}, {ssoid, email, type});
    }
    await confRepository.update({userid}, {cccyn});

    //FIXME: 단일 캠퍼스만 수정되는 거니까, 나중에 다중 캠퍼스로 가면, 변경되야겠네요
    //TODO: 사용자 변경시, UserHistory에 저장
    await campusRepository.update({userid, campusid}, {major, sid});
    const result = await repository.update({userid}, {nickname, gender});
    return result;
  });
}

export async function editUserRefresh(userid: number, params: {refresh_token: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    return repository.update({userid}, params);
  });
}

export async function removeUser(userid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(User);
    const configRepository = manager.getRepository(UserConfig);
    const loginRepository = manager.getRepository(UserLogin);
    const historyRepository = manager.getRepository(UserHistory);
    const authRepository = manager.getRepository(UserAuth);
    const campusRepository = manager.getRepository(UserCampus);
    const soonRepository = manager.getRepository(Soon);
    const prayRepository = manager.getRepository(pray);
    const soonHistoryRepository = manager.getRepository(SoonHistory);

    /*
      article이랑은 삭제 안만듦..
    */
    await configRepository.delete({userid});
    await loginRepository.delete({userid});
    await historyRepository.delete({userid});
    await authRepository.delete({userid});
    await campusRepository.delete({userid});

    await soonRepository.delete({sjid: userid});
    await soonRepository.delete({swid: userid});
    const histories = await soonHistoryRepository.find({where: [{sjid: userid}, {swid: userid}]});
    if (histories?.length > 0) {
      const ids = histories?.map(({historyid}) => historyid);
      await prayRepository.delete({historyid: ids});
    }
    await soonHistoryRepository.delete({sjid: userid});
    await soonHistoryRepository.delete({swid: userid});
    return repository.delete({userid});
    // return repository.delete({userid});
  });
}
