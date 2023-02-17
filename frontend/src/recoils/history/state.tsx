import {atom} from "recoil";

export const categoryState = atom({
  key: "cateogryState",
  default: [
    {id: "soon", name: "순모임"}, //순모임
    {id: "coffee", name: "커피 타임"}, //커피타임
    {id: "activity", name: "외부 활동"}, //외부활동
    {id: "unity", name: "합동 순모임"}, //합동 순모임
  ],
});
