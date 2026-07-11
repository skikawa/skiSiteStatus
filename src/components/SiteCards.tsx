import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import SiteCard from "@/components/SiteCard";
import { useStatusStore } from "@/stores/statusStore";
import { STATUS_COLORS } from "@/theme";

const SiteCards: React.FC = () => {
  const { siteStatus, siteData, getSiteData } = useStatusStore();

  // Loading state
  if (siteStatus === "loading" && !siteData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
          maxWidth: 900,
          mx: "auto",
          px: 2.5,
        }}
      >
        <CircularProgress
          size={40}
          sx={{ color: STATUS_COLORS.loading }}
        />
      </Box>
    );
  }

  // Error/unknown state with no data
  if ((siteStatus === "unknown" || siteStatus === "error") && !siteData) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 2.5,
          my: 3.75,
        }}
      >
        <Alert
          severity="error"
          action={
            <Button
              color="error"
              size="small"
              onClick={() => getSiteData()}
            >
              重试
            </Button>
          }
        >
          加载失败
        </Alert>
      </Box>
    );
  }

  // No data available
  if (!siteData?.data || siteData.data.length === 0) {
    return null;
  }

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 900,
        mx: "auto",
        my: "30px auto 20px",
        px: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {siteData.data.map((site, index) => (
        <SiteCard key={site.id} site={site} index={index} />
      ))}
    </Box>
  );
};

export default SiteCards;