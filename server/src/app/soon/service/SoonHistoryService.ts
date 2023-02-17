import {txProcess} from "@lib/db";
import SoonHistory from "@soon/entity/SoonHistory";
import SoonPray from "@soon/entity/SoonPray";
import {In} from "typeorm";

export async function getSoonHistory(historyid: number) {

  return await SoonHistory.findOne({where: {historyid}, relations: {soonjang: true, soonwon: true, prays: true}});

}

export async function getSoonHistorySWList(swid: number) {
  return await SoonHistory.find({where: {swid}, relations: {soonjang: true, soonwon: true}});
}

export async function getSoonHistorySJList(sjid: number) {
  return await SoonHistory.find({where: {sjid}, relations: {soonjang: true, soonwon: true}});
}
export async function getSoonHistorySJListNotMe(sjid: number, campues: string[]) {
  return await SoonHistory.find({
    // select: {historyid: true, soonwon: {nickname: true}},
    where: {sjid, soonwon: {campus: {campusid: In(campues)}}},
    relations: {soonwon: true},
  });
}
// export async function getSoonHistorySJListNotMe(sjid: number, campues: string[]) {
//   return await SoonHistory.find({where: {sjid, soonwon: {campus: {campusid: In(campues)}}}, relations: {soonwon: {campus: true}}});
// }


export async function editSoonHistory(
  historyid: number,
  history: {
    userid?: number;
    sjid: number;
    swid: number;
    kind: string;
    progress: string;
    historydate: Date;
    contents?: string;
  },
) {

  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonHistory);
    if (history.userid == undefined) {
      history.userid = history.sjid;
    }
    const historyData = await repository.update({historyid}, history);

    return historyData;
  });
}

export async function addSoonHistory(history: {
  userid?: number;
  sjid: number;
  swid: number;
  kind: string;
  progress: string;
  historydate: Date;
  contents?: string;
  prays?:any;
}) {
  /* {
    pray: string;
    publicyn: string;
  }[]; */
  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonHistory);
    const prayRepository = manager.getRepository(SoonPray);
    if (history.userid == undefined) {
      history.userid = history.sjid;
    }

    const historyData = await repository.save(history);
    const historyid = historyData.historyid;
    if (history?.prays && history?.prays?.length > 0) {
      const prays = history?.prays.map((pray:any) => ({historyid, ...pray}));
      await prayRepository.save(prays);
    }
    return historyData;
  });
}

export async function removeSoonHistory(historyid: number) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonHistory); // master
    const prayRepository = manager.getRepository(SoonPray); //종속
    await prayRepository.delete(historyid);
    return await repository.delete(historyid);
  });
}
