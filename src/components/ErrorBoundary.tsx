import { Component, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
            gap: 2,
            px: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            页面出现错误
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message || "未知错误"}
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            重试
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;