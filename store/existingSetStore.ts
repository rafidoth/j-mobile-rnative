import { create } from "zustand";

type ExistingSetState = {
  showAnswer: boolean;
  toggleShowAnswer: () => void;
};

const existingSetStore = (set: any): ExistingSetState => ({
  showAnswer: false,
  toggleShowAnswer: () =>
    set((state: ExistingSetState) => ({ showAnswer: !state.showAnswer })),
});

const useExistingSetStore = create<ExistingSetState>(existingSetStore);
export default useExistingSetStore;
