import Campus from "@campus/entity/Campus";
import {txProcess} from "@lib/db";

export async function getCampusList(areaid = "VLM") {
  return await Campus.find({where: {areaid}, relations: {area: true}});
}
export async function getCampusInfo(campusid: string) {
  return await Campus.findOne({where: {campusid}, relations: {area: true}});
}
export async function addCampus(campus: {name: string; areaid: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Campus);
    return await repository.save(campus);
  });
}
export async function removeCampus(campusid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Campus);
    return await repository.delete({campusid});
  });
}
