"use client";

import React from "react";
import { Fab, CircularProgress } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface RefreshButtonProps {
  isFetching: boolean;
  onRefresh: () => void;
}

export default function RefreshButton({
  isFetching,
  onRefresh,
}: RefreshButtonProps) {
  return (
    <Fab
      color="primary"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        opacity: isFetching ? 0.5 : 1,
      }}
      onClick={onRefresh}
      disabled={isFetching}
    >
      {isFetching ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <Refresh />
      )}
    </Fab>
  );
}
