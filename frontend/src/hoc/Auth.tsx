import {FC, Suspense} from "react";
import {Navigate} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {userSelector, userState} from "@recoils/User/state";

export default (SpecificComponent: FC, option: boolean | null) => {
  const [loginUser, setLoginUser] = useRecoilState(userState);
  const Component = () => {
    // T = login, F = Not Login, null = Anyone
    if (option === true && (loginUser == "" || loginUser == null)) {
      const user = useRecoilValue(userSelector);
      if (user == null || user?.userid == undefined) {
        return (
          // <Suspense fallback={<div>Loading...</div>}>
          <Navigate to="/login" replace={true} />
          // </Suspense>
        );
      } else {
        setLoginUser(user);
        return <SpecificComponent />;
      }
      // return <Navigate to="/login" replace={true} />;
    } else if (option === false) {
      return <SpecificComponent />;
    } else {
      return <SpecificComponent />;
    }
  };
  return <Component />;
};
