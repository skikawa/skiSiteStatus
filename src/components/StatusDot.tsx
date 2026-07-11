import React from "react";
import Box from "@mui/material/Box";

interface StatusDotProps {
  size?: number;
  color: string;
  breatheColor?: string;
}

const StatusDot: React.FC<StatusDotProps> = React.memo(({
  size = 14,
  color,
  breatheColor,
}) => (
  <Box
    sx={{
      position: "relative",
      width: size,
      height: size,
      minWidth: size,
      bgcolor: color,
      borderRadius: "50%",
      transition: "background-color 1s",
      "&::after": {
        content: '""',
        bgcolor: breatheColor ?? color,
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        opacity: 1,
        zIndex: -1,
        animation: "breathing 1.5s ease infinite",
        transition: "background-color 1s",
      },
    }}
  />
));

export default StatusDot;