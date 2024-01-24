import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type teamDetails = {
  team_name: string | null;
  setTeamName: (team_name: string | null) => void;
};
export const useTeamNameStore = create(
  persist<teamDetails>(
    (set) => ({
      team_name: null,
      setTeamName: (team_name: string | null) => set({ team_name }),
    }),
    {
      name: "team_name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
