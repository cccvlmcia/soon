import {Box} from "@mui/material";
import React from "react";

export default function NoData() {
  return (
    <Box
      sx={{
        textAlign: "center",
        height: "30px",
        lineHeight: "30px",
        background: "#FFF !Important",
        border: "0 !important",
        opacity: "0.5",
        fontWeight: "400 !important",
      }}>
      데이터가 없습니다
    </Box>
  );
}
