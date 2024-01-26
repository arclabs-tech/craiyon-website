import { create } from "zustand";
import { cookies } from "next/headers";

type teamDetails = {
  team_name: string | null;
  setTeamName: (team_name: string) => void;
};
export const useTeamNameStore = create<teamDetails>()((_) => ({
  team_name: cookies().get("team_name")?.toString() || null,
  setTeamName: (team_name: string) => cookies().set("team_name", team_name),
}));
