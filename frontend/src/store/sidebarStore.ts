import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  reset: () => void;
}

const initialSidebarState: SidebarState = {
  isOpen: true,
  setIsOpen: () => {},
  toggle: () => {},
  reset: () => {},
};

export const useSidebarStore = create<SidebarState>((set) => ({
  ...initialSidebarState,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  reset: () => set(initialSidebarState),
}));