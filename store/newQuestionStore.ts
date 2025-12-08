import { create } from "zustand";

type NewQuestionState = {
  created: any | null;
  setCreated: (q: any | null) => void;
};

const newQuestionStore = (set: any): NewQuestionState => ({
  created: null,
  setCreated: (q) => set({ created: q }),
});

const useNewQuestionStore = create<NewQuestionState>(newQuestionStore);
export default useNewQuestionStore;
