import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import StatusDot from "@/components/StatusDot";
import DayBar from "@/components/DayBar";
import type { SiteStatusType } from "@/types/main";
import { STATUS_COLORS } from "@/theme/constants";
import { formatInterval, formatDuration, formatTime } from "@/utils/time";

// Monitor type mapping
const siteTypeMap: Record<number, string> = {
  1: "HTTP",
  2: "KEYWORD",
  3: "PING",
  4: "PORT",
  5: "HEARTBEAT",
};

// Site status text mapping
const siteStatusMap: Record<number, { text: string; color: "normal" | "error" | "unknown" }> = {
  0: { text: "暂停", color: "unknown" },
  1: { text: "未知", color: "unknown" },
  2: { text: "正常", color: "normal" },
  8: { text: "异常", color: "error" },
  9: { text: "宕机", color: "error" },
};

interface SiteCardProps {
  site: SiteStatusType;
  index: number;
}

const SiteCard: React.FC<SiteCardProps> = React.memo(({ site, index }) => {
  const statusInfo = siteStatusMap[site.status] ?? siteStatusMap[1]!;
  const statusColor = STATUS_COLORS[statusInfo.color];
  const typeLabel = siteTypeMap[site.type] || "HTTP";
  const intervalLabel = formatInterval(site.interval);

  // Date range from days array (oldest first, newest last after server reverse)
  const days = site.days || [];
  const firstDay = days.length > 0 ? days[0] : null;
  const lastDay = days.length > 0 ? days[days.length - 1] : null;

  // Summary text
  const summaryText = site.down.times > 0
    ? `${days.length} 天内故障 ${site.down.times} 次，时长 ${formatDuration(site.down.duration)}，可用率 ${site.percent}%`
    : `${days.length} 天内可用率 ${site.percent}%`;

  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        animation: `floatUp 0.5s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        {/* Card header: name + type chip + link | status indicator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: name + chip + link */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              noWrap
              sx={{ fontWeight: 700, fontSize: "20px" }}
            >
              {site.name}
            </Typography>
            <Chip
              label={`${typeLabel} / ${intervalLabel}`}
              size="small"
              variant="filled"
              sx={{ borderRadius: 1, height: 20, fontSize: 12, flexShrink: 0 }}
            />
            {site.url && (
              <IconButton
                size="small"
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ flexShrink: 0 }}
              >
                <OpenInNewRounded sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {/* Right: status indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0, ml: 1 }}>
            {site.status === 0 ? (
              <PauseRounded sx={{ fontSize: 14, color: statusColor }} />
            ) : (
              <StatusDot size={14} color={statusColor} />
            )}
            <Typography
              variant="body2"
              sx={{ color: statusColor, fontWeight: 500 }}
            >
              {statusInfo.text}
            </Typography>
          </Box>
        </Box>

        {/* Day bar chart */}
        {days.length > 0 && <DayBar days={days} />}

        {/* Card footer: date range + summary */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
            color: "text.secondary",
          }}
        >
          <Box sx={{ width: 100 }}>
            {firstDay?.date ? formatTime(firstDay.date, { showTime: false }) : ""}
          </Box>
          <Typography variant="caption" sx={{ fontSize: "13px", color: "text.secondary" }}>
            {summaryText}
          </Typography>
          <Box sx={{ width: 100, textAlign: "right" }}>
            {lastDay?.date ? formatTime(lastDay.date, { showTime: false }) : ""}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default SiteCard;