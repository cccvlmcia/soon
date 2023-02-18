export const titles: any = {
  "/login": "로그인",
  "/register": "회원가입",
  "/campus": "캠퍼스",
  "/history": "순 히스토리",
  "/admin": "순 설정",
  "/soon/list": "순 목록",
  "/withdrawal": "회원탈퇴",
  "/myprofile": "프로필",
  "/myprofile/add": "캠퍼스 추가",
  "/": " ",
};

export function getTitle(pathname: string) {
  return titles[pathname] || includes(pathname);
}

function includes(pathname: string) {
  const keys = Object.keys(titles);
  const obj = keys?.find(key => pathname?.startsWith(key)) || "";
  return titles[obj] || "상세조회";
}
