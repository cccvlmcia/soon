import {CommonYN} from "@common/CommonConstants";
import {txProcess} from "@lib/db";
import SoonPray from "@soon/entity/SoonPray";

export async function removeSoonPray(prayid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonPray);
    return await repository.delete(prayid);
  });
}

export async function editSoonPray(prayid: number, prays: {pray: string ,publicyn: CommonYN}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonPray);
    return await repository.update({prayid}, prays);
  });
}
