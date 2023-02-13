import {ERROR_AUTH_NOTEXISTS} from "@error/AuthCode";
import {txProcess} from "@lib/db";
import User from "@user/entity/User";
import UserLogin from "@user/entity/UserLogin";
import {setAuthAdmin} from "@utils/AuthUtils";

export async function getUserLogin(ssoid: string, userid?: number) {
  return await UserLogin.findOne({where: {ssoid, userid}, relations: {user: true}});
}
export async function addUserLogin(userid: number, login: {ssoid: string; email: string; type: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserLogin);
    const userRepository = manager.getRepository(User);
    const user = await userRepository.findOne({where: {userid}});
    if (user) {
      const email = login.email;
      const config = await setAuthAdmin(manager, userid, email);
      return await repository.save({userid, ...login});
    } else {
      //FIXME: userid가 없어? loginid 연동을 시도해....
      // return {status: LOGIN_STATUS.REGISTER, auth: login};
      return new Error("ERROR_AUTH_NOTEXISTS");
    }
  });
}
export async function removeUserLogin({userid, ssoid}: {userid: number; ssoid: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserLogin);
    const login = await repository.findOne({where: {userid, ssoid}});
    if (login) {
      const email = login.email;
      const config = await setAuthAdmin(manager, userid, email, {removed: true});
    }
    return await repository.delete({userid, ssoid});
  });
}
