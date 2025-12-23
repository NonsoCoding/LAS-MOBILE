import { create } from "zustand";

interface UserState {
  profile: any | null;

  setProfile: (profile: any) => void;
  updateProfileField: (field: string, value: any) => void;
}

const UserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),

  updateProfileField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),
}));

export default UserStore;
