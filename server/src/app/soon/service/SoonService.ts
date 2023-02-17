import {txProcess} from "@lib/db";
import Soon from "@soon/entity/Soon";

//순장의 순원 목록
export async function getSoonList(sjid: number) {
  return await Soon.find({where: {sjid}, relations: {soonjang: {campus: {campus: true}}, soonwon: {campus: {campus: true}}}});
}

export async function getSoonInfo(swid: number) {
  return await Soon.findOne({where: {swid}, relations: {soonjang: true, soonwon: true}});
}

export async function getSoonId(sjid: number, swid: number) {
  return await Soon.findOne({where: {sjid, swid}, relations: {soonjang: true, soonwon: true}});
}

export async function addSoon(soon: {sjid: number; swid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Soon);
    return await repository.save(soon);
  });
}

export async function removeSoon(soon: {sjid: number; swid: number}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(Soon);
    return await repository.delete(soon);
  });
}
