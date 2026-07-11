import { useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpRounded from "@mui/icons-material/KeyboardArrowUpRounded";
import SiteNav from "@/components/SiteNav";
import SiteHeader from "@/components/SiteHeader";
import SiteCards from "@/components/SiteCards";
import SiteFooter from "@/components/SiteFooter";
import { useStatusStore } from "@/stores/statusStore";

/** Status to favicon path mapping */
const FAVICON_MAP: Record<string, string> = {
  normal: "/favicon.ico",
  loading: "/favicon.ico",
  error: "/favicon-error.ico",
  warn: "/favicon-error.ico",
  unknown: "/favicon-error.ico",
};

/** Status to page title suffix */
const TITLE_MAP: Record<string, string> = {
  normal: "✅",
  loading: "⏳",
  error: "🔴",
  warn: "🟡",
  unknown: "❓",
};

const Layout: React.FC = () => {
  const { siteStatus, scrollTop, setScrollTop } = useStatusStore();
  const siteTitle = import.meta.env.VITE_SITE_TITLE || "Site Status";

  // Scroll container management — track window scroll position (rAF throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollTop(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollTop]);

  // Dynamic page title update based on site status
  useEffect(() => {
    const icon = TITLE_MAP[siteStatus] ?? "";
    document.title = `${icon} ${siteTitle}`;
  }, [siteStatus, siteTitle]);

  // Dynamic favicon update based on site status
  useEffect(() => {
    const faviconPath = FAVICON_MAP[siteStatus] ?? "/favicon.ico";
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (link) {
      link.href = faviconPath;
    }
  }, [siteStatus]);

  // Back to top handler
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <SiteHeader />
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 3,
        }}
      >
        <SiteCards />
      </Box>
      <SiteFooter />

      {/* Back to top Fab */}
      {scrollTop > 300 && (
        <Fab
          size="medium"
          color="primary"
          aria-label="scroll back to top"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            transition: "opacity 0.3s, transform 0.3s",
            opacity: scrollTop > 300 ? 1 : 0,
            transform: scrollTop > 300 ? "scale(1)" : "scale(0)",
          }}
        >
          <KeyboardArrowUpRounded />
        </Fab>
      )}
    </Box>
  );
};

export default Layout;