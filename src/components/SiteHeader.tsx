import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import StatusDot from "@/components/StatusDot";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";
import { useStatusStore } from "@/stores/statusStore";
import { GRADIENT_COVERS } from "@/theme";
import type { SiteType } from "@/types/main";
import { formatTime } from "@/utils/time";

// Status text mapping
const STATUS_TEXT: Record<SiteType, string> = {
  loading: "加载中",
  normal: "所有系统运行正常",
  error: "部分服务已宕机",
  warn: "部分服务异常",
  unknown: "无法获取服务状态",
};

const SiteHeader: React.FC = () => {
  const { siteStatus, siteData, getSiteData } = useStatusStore();

  // Countdown: 300s auto-refresh
  const [remaining, resetCountdown] = useCountdown(() => {
    getSiteData();
  });

  // Initial data fetch
  useEffect(() => {
    getSiteData();
  }, [getSiteData]);

  // Refresh handler with cooldown (5 min)
  const handleRefresh = () => {
    if (remaining > 0 && remaining < 300) return; // cooldown period
    getSiteData();
    resetCountdown();
  };

  // Format update time
  const updateTime = siteData?.timestamp
    ? formatTime(siteData.timestamp, { showOnlyTimeIfToday: true })
    : "--";

  const statusText = STATUS_TEXT[siteStatus];
  const gradientBg = GRADIENT_COVERS[siteStatus];

  return (
    <Box
      sx={{
        position: "relative",
        height: "44vh",
        width: "100%",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Gradient background layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -2,
          background: gradientBg,
          backgroundSize: "400%",
          transition: "filter 0.3s",
        }}
      />

      {/* Content layer */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 2.5,
          pt: 3.75,
          pb: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // Offset for fixed AppBar
          mt: "64px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "100%",
            px: 2.5,
          }}
        >
          {/* Left: Status indicator + text */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <StatusDot size={40} color="#fff" breatheColor="rgba(255,255,255,0.5)" />
            <Box sx={{ ml: 3.75 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                {statusText}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, color: "#fff" }}
                >
                  更新于 {updateTime}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.6,
                    color: "#fff",
                    mx: 1,
                    fontSize: "12px",
                  }}
                >
                  |
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, color: "#fff" }}
                >
                  {formatCountdown(remaining)} 后更新
                </Typography>
                <IconButton
                  onClick={handleRefresh}
                  size="small"
                  sx={{
                    color: "#fff",
                    ml: 1.25,
                    height: 22,
                    width: 22,
                    "& .MuiSvgIcon-root": { fontSize: 18 },
                  }}
                >
                  <RefreshRounded />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SiteHeader;