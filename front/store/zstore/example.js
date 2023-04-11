import { create, useStore } from 'zustand';

const bearStore = create((set, get) => {
  const fishStore = useStore((state) => state.fishStore);
  return {
    bears: 2,
    happy: false,
    eatFish: () => {
      set( (s) => ({ happy: true }))
      fishStore.set((s) => ({ fishes: s.fishes - 1 }))
    }
  };
});

const fishStore = create((set) => ({
  fishes: 4,
}));