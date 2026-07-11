import { ThemeProvider, CssBaseline } from "@mui/material";
import lightTheme from "@/theme";
import Layout from "./Layout";
import ErrorBoundary from "@/components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;