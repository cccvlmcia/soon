import {FC} from "react";
import {Navigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {userState} from "@recoils/User/state";

export default (SpecificComponent: FC, option: boolean | null) => {
  const loginUser = useRecoilValue(userState);
  const Component = () => {
    // T = login, F = Not Login, null = Anyone
    if (option === true && (loginUser == "" || loginUser == null)) {
      return <Navigate to="/login" replace={true} />;
    } else if (option === false) {
      return <SpecificComponent />;
    } else {
      return <SpecificComponent />;
    }
  };
  return <Component />;
};
