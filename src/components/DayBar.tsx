import React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { STATUS_COLORS } from "@/theme/constants";
import type { SiteDaysStatus } from "@/types/main";
import { formatTime, formatDuration } from "@/utils/time";

interface DayBarProps {
  days: SiteDaysStatus[];
}

/** Get bar color based on availability percent */
const getBarColor = (percent: number): string => {
  if (percent >= 100) return STATUS_COLORS.normal;
  if (percent >= 50) return STATUS_COLORS.warn;
  if (percent >= 1) return STATUS_COLORS.error;
  return STATUS_COLORS.unknown;
};

/** Build tooltip content for a day */
const getTooltipContent = (day: SiteDaysStatus): string => {
  const dateStr = day.date ? formatTime(day.date, { showTime: false }) : "未知日期";
  if (day.percent === 0) return `${dateStr}\n无数据`;
  if (day.percent >= 100) return `${dateStr}\n可用率 100%`;
  const { times, duration } = day.down;
  return `${dateStr}\n故障 ${times} 次，时长 ${formatDuration(duration)}，可用率 ${day.percent}%`;
};

const DayBar: React.FC<DayBarProps> = React.memo(({ days }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 0.25,
        my: 1.875,
      }}
    >
      {days.map((day, index) => (
        <Tooltip
          key={index}
          title={getTooltipContent(day)}
          placement="top"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                whiteSpace: "pre-line",
                fontSize: 12,
                borderRadius: 1,
              },
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: 26,
              borderRadius: "25px",
              bgcolor: getBarColor(day.percent),
              cursor: "pointer",
              transition: "transform 0.3s",
              transformOrigin: "bottom",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
});

export default DayBar;