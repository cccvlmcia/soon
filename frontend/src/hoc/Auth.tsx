import { FC } from "react";
export default (SpecificComponent: FC, option: boolean | null) => {
  const Component = () => {
    // T = login, F = Not Login, null = Anyone
    if (option === true) {
      return <SpecificComponent />;
    } else if (option === false) {
      return <SpecificComponent />;
    } else {
      return <SpecificComponent />;
    }
  };
  return <Component />;
};
