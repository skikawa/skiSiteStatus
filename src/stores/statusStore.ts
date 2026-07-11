import { create } from "zustand";
import type { MonitorsDataResult, SiteType } from "@/types/main";
import { getMonitors } from "@/utils/api";

interface StatusState {
  siteStatus: SiteType;
  siteData: MonitorsDataResult | null;
  scrollTop: number;
}

interface StatusActions {
  setSiteStatus: (status: SiteType) => void;
  setSiteData: (data: MonitorsDataResult | null) => void;
  setScrollTop: (top: number) => void;
  getSiteData: () => Promise<void>;
}

export const useStatusStore = create<StatusState & StatusActions>((set) => ({
  siteStatus: "loading",
  siteData: null,
  scrollTop: 0,

  setSiteStatus: (status) => set({ siteStatus: status }),
  setSiteData: (data) => set({ siteData: data }),
  setScrollTop: (top) => set({ scrollTop: top }),

  getSiteData: async () => {
    try {
      set({ siteStatus: "loading" });
      const result = await getMonitors();
      if (result.code !== 200 || !result.data) {
        throw new Error(result.message || "Error to get site data");
      }
      const { status } = result.data;
      set({
        siteData: result.data,
        siteStatus:
          status.count === status.ok
            ? "normal"
            : status.error === status.count
              ? "error"
              : "warn",
      });
    } catch (error) {
      console.error("error to get site data", error);
      set({ siteStatus: "unknown" });
    }
  },
}));