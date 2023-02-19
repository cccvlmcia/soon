import {SoonType} from "./../SoonConstants";
import {txProcess} from "@lib/db";
import SoonHistory from "@soon/entity/SoonHistory";
import SoonPray from "@soon/entity/SoonPray";
import {In, SimpleConsoleLogger} from "typeorm";
import SoonHistoryUser from "@soon/entity/SoonHistoryUser";
import User from "@user/entity/User";

export async function getSoonHistory(historyid: number) {
  return await SoonHistory.findOne({where: {historyid}, relations: {soonjang: true, users: true, prays: true}});
}

export async function getSoonHistorySWList(swid: number) {
  return await SoonHistory.find({where: {users: {swid}}, relations: {soonjang: true, users: true}});
}

export async function getSoonHistorySJList(sjid: number) {
  return await SoonHistory.find({where: {sjid}, relations: {soonjang: true, users: true}});
}
export async function getSoonHistorySJListNotMe(sjid: number, campues: string[]) {
  return await SoonHistory.find({
    // select: {historyid: true, soonwon: {nickname: true}},
    where: {sjid, users: {campusid: In(campues)}},
    relations: {users: true},
  });
}

export async function editSoonHistory(
  historyid: number,
  history: {
    userid?: number;
    sjid: number;
    kind: SoonType;
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
    const {userid, sjid, kind, progress, historydate, contents} = history;
    const historyData = await repository.update({historyid}, {userid, sjid, kind, progress, historydate, contents});
    console.log("history data : ", history);
    return historyData;
  });
}
//순원 swids로 해서 등록하는데... 실제로 조회 될 때는 순원들 누구 누구 했는지 ... 할 수있게 어떻게 하누
//swid를 볼 수 있는> soon_history_user table[historyid, swid, createdate]

//TODO: 나중에
//  - 사진도 올릴 수 있게
//  - 내용도 공개 여부 설정
//  - UI Navigation 구조로 변경
export async function addSoonHistory(history: {
  userid?: number;
  sjid: number;
  swids: number[];
  kind: string;
  progress: string;
  historydate: Date;
  contents?: string;
  prays?: any;
}) {
  /* {
    pray: string;
    publicyn: string;
  }[]; */
  return await txProcess(async manager => {
    const repository = manager.getRepository(SoonHistory);
    const userRepository = manager.getRepository(User);
    const historyUserRepository = manager.getRepository(SoonHistoryUser);
    const prayRepository = manager.getRepository(SoonPray);
    if (history.userid == undefined) {
      history.userid = history.sjid;
    }

    const historyData = await repository.save(history);
    const historyid = historyData.historyid;
    if (historyid) {
      const {swids} = history;
      if (swids && swids?.length > 0) {
        const users = await userRepository.find({where: {userid: In(swids)}, relations: {campus: {campus: true}, login: true}});
        if (users?.length > 0) {
          const historyUsers = users?.map(({userid, nickname, login, campus}: User) => {
            const email = (login?.length && login[0].email) || "";
            const campusInfo = (campus?.length > 0 && campus[0]) || {sid: 0, major: "", campusid: "", campus: {name: ""}};
            return {
              historyid,
              swid: userid,
              email,
              sid: campusInfo?.sid,
              nickname,
              campusid: campusInfo?.campusid,
              campusname: campusInfo?.campus?.name,
              major: campusInfo?.major,
            };
          });
          await historyUserRepository.save(historyUsers);
        }
      }
      if (history?.prays && history?.prays?.length > 0) {
        const prays = history?.prays.map((pray: any) => ({historyid, ...pray}));
        await prayRepository.save(prays);
      }
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
