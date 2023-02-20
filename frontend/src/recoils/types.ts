export type postUser = {
  nickname: string;
  gender: string;
  cccyn: string;
  campusid: string;
  major: string;
  sid: string;
  ssoid: string;
  email: string;
  type: string;
};
export type Prayer = {
  pray: string;
  publicyn: string;
};
export type HistoryForm = {
  sjid: string;
  swids: string[];
  kind: string;
  progress: string;
  historydate: Date;
  contents: string;
  prayer: string;
  prays: Prayer[];
};
export type HistoryEditForm = {
  sjid: string;
  swid: string;
  kind: string;
  progress: string;
  historydate: Date;
  contents: string;
  prayer: string;
};

export type User = {
  userid: string;
  nickname: string;
};

export type Category = {
  id: string;
  name: string;
};
