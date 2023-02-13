import Area from "@campus/entity/Area";
import {txProcess} from "@lib/db";

export async function getAreaList() {
  return await Area.find();
}

export async function getAreaInfo(areaid: string) {
  return await Area.findOne({where: {areaid}});
}

export async function addArea(area: {areaid: string; name: string}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Area);
    return await repository.save(area);
  });
}

export async function removeCampus(areaid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Area);
    return await repository.delete({areaid});
  });
}
