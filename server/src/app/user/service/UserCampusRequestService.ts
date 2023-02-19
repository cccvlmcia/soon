import {txProcess} from "@lib/db";
import UserCampus from "@user/entity/UserCampus";
import UserCampusRequest from "@user/entity/UserCampusRequest";

export async function signUserCampusRequest(reqid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(UserCampusRequest);
    const campusRepo = manager.getRepository(UserCampus);
    const req = await repository.findOne({where: {reqid}});
    if (req) {
      await repository.delete({reqid});
      return await campusRepo.save(req);
    }
    return null;
  });
}
