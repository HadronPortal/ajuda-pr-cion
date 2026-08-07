import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Prize {
  id: string;
  label: string;
  probability: number; // 0 to 100
  color: string;
}

interface GameState {
  prizes: Prize[];
  coverUrl: string;
  backgroundUrl: string;
  addPrize: (prize: Omit<Prize, "id">) => void;
  removePrize: (id: string) => void;
  updatePrize: (id: string, updates: Partial<Prize>) => void;
  resetGame: () => void;
}

const DEFAULT_PRIZES: Prize[] = [
  { id: "1", label: "Prêmio 1", probability: 25, color: "#3B82F6" },
  { id: "2", label: "Prêmio 2", probability: 25, color: "#10B981" },
  { id: "3", label: "Prêmio 3", probability: 25, color: "#F59E0B" },
  { id: "4", label: "Prêmio 4", probability: 25, color: "#EF4444" },
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      prizes: DEFAULT_PRIZES,
      coverUrl: "/src/assets/game/cover.jpg",
      backgroundUrl: "/src/assets/game/background.jpg",
      addPrize: (prize) =>
        set((state) => {
          if (state.prizes.length >= 4) return state;
          return {
            prizes: [...state.prizes, { ...prize, id: crypto.randomUUID() }],
          };
        }),
      removePrize: (id) =>
        set((state) => ({
          prizes: state.prizes.filter((p) => p.id !== id),
        })),
      updatePrize: (id, updates) =>
        set((state) => ({
          prizes: state.prizes.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      resetGame: () => set({ prizes: DEFAULT_PRIZES }),
    }),
    {
      name: "game-storage",
    }
  )
);
