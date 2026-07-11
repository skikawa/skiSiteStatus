import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useStatusStore } from "@/stores/statusStore";

const SiteNav: React.FC = () => {
  const scrollTop = useStatusStore((s) => s.scrollTop);

  const scrolled = scrollTop > 0;
  // Icon color: white on transparent (over header gradient), text.primary on paper
  const logoColor = scrolled ? "text.primary" : "#fff";

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 2 : 0}
      sx={{
        bgcolor: scrolled ? "background.paper" : "transparent",
        borderBottom: scrolled ? 1 : 0,
        borderColor: "divider",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: "auto",
          px: 2.5,
          py: scrolled ? 1.5 : 3.75,
          transition: "padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: logoColor,
            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            fontSize: { xs: "16px", sm: "20px" },
            flexGrow: 1,
          }}
        >
          {import.meta.env.VITE_SITE_TITLE || "Site Status"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default SiteNav;