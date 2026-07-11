import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    status: {
      loading: string;
      normal: string;
      error: string;
      warn: string;
      unknown: string;
    };
  }

  interface PaletteOptions {
    status: {
      loading: string;
      normal: string;
      error: string;
      warn: string;
      unknown: string;
    };
  }
}