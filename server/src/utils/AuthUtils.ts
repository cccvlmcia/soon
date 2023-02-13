import {EntityManager} from "typeorm";
import {CommonYN} from "@common/CommonConstants";
import {haqqaton} from "@config/haqqaton.config";
import UserConfig from "@user/entity/UserConfig";
const {domains} = haqqaton;

export const setAuthAdmin = async (manager: EntityManager, userid: number, email: string, options?: {cccyn?: CommonYN; removed?: boolean}) => {
  const confRepository = manager.getRepository(UserConfig);
  const isInclude = domains?.filter(domain => email.includes(domain))?.length || 0 > 0;
  let adminyn = undefined;
  let cccyn = options?.cccyn || undefined;
  if (isInclude) {
    cccyn = CommonYN.Y;
    if (options?.removed) {
      adminyn = CommonYN.N;
    } else {
      adminyn = CommonYN.Y;
    }
  }
  return await confRepository.save({userid, cccyn, adminyn});
};
