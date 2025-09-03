import { useNavigation } from "@/providers/NavigationProvider";
import { SacredJourneyNavigation } from "./SacredJourneyNavigation";
import { ExplorerNavigation } from "./ExplorerNavigation";

export function AdaptiveNavigation() {
  const { mode } = useNavigation();

  return mode === 'sacred-journey' ? (
    <SacredJourneyNavigation />
  ) : (
    <ExplorerNavigation />
  );
}