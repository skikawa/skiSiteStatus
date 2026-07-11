// Status color constants
export const STATUS_COLORS = {
  loading: "#58d0ff",
  normal: "#3bd672",
  error: "#de484a",
  warn: "#f39c12",
  unknown: "#7f8c8d",
} as const;

// Gradient background constants for SiteHeader
export const GRADIENT_COVERS = {
  loading: "radial-gradient(circle, #00c6ff, #0072ff, #00d2ff, #00b0ff)",
  error: "radial-gradient(circle, #ff4b5c, #ff2a3b, #ff6f5e, #f15239)",
  warn: "radial-gradient(circle, #ffa500, #ff8c00, #ff7f00, #ff6600)",
  unknown: "radial-gradient(circle, #7f8c8d, #b5b5b5, #858c8d, #34495e)",
  normal: "radial-gradient(circle, #2ecc71, #27ae60, #16a085, #1abc9c)",
} as const;