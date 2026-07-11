import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeRounded from "@mui/icons-material/HomeRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import SvgIcon from "@mui/material/SvgIcon";
import { STATUS_COLORS } from "@/theme";

const GitHubIcon = () => (
  <SvgIcon viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </SvgIcon>
);

const VERSION = "2.0.0";
const CURRENT_YEAR = new Date().getFullYear();
const ICP = import.meta.env.VITE_SITE_ICP || "";

const SiteFooter: React.FC = () => {
  const icp = ICP;
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: "auto",
        pt: 7.5,
        px: 2.5,
        pb: 11.25,
        zIndex: 100,
      }}
    >
      {/* Social links */}
      <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
        <IconButton
          href="https://github.com/imsyy/site-status"
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          href="https://imsyy.top"
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
        >
          <HomeRounded />
        </IconButton>
        <IconButton
          href="mailto:imsyy@foxmail.com"
          size="medium"
        >
          <EmailRounded />
        </IconButton>
      </Box>

      {/* Text info */}
      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: "13px",
          lineHeight: "26px",
          mt: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: "13px", lineHeight: "26px" }}>
          SiteStatus Version {VERSION}
        </Typography>
        <br />
        <Typography variant="caption" sx={{ fontSize: "13px", lineHeight: "26px" }}>
          Based on{" "}
          <Box
            component="a"
            href="https://uptimerobot.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { color: STATUS_COLORS.normal },
              transition: "color 0.3s",
            }}
          >
            UptimeRobot
          </Box>
          {" "}API | 检测频率 5 分钟
        </Typography>
        <br />
        <Typography variant="caption" sx={{ fontSize: "13px", lineHeight: "26px" }}>
          Copyright &copy; 2020 - {CURRENT_YEAR}{" "}
          <Box
            component="a"
            href="https://imsyy.top"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontWeight: "bold",
              cursor: "pointer",
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { color: STATUS_COLORS.normal },
              transition: "color 0.3s",
            }}
          >
            IMSYY
          </Box>
          {icp && (
            <>
              {" "}
              |{" "}
              <Box
                component="a"
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  cursor: "pointer",
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": { color: STATUS_COLORS.normal },
                  transition: "color 0.3s",
                }}
              >
                {icp}
              </Box>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default SiteFooter;