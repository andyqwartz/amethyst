import { create } from 'zustand';

export interface DeleteImageModalData {
  imageUrl?: string;
  onConfirm: () => void;
}

export interface HelpModalData {
  section?: string;
  topic?: string;
}

export enum ModalId {
  DELETE_IMAGE = 'delete-image',
  HELP = 'help'
}

export type ModalData = {
  type: ModalId.DELETE_IMAGE;
  data: DeleteImageModalData;
} | {
  type: ModalId.HELP;
  data: HelpModalData;
};

interface ModalState {
  activeModals: {
    [key in ModalId]?: {
      isOpen: boolean;
      data?: any;
    };
  };
  openModal: (modalId: ModalId, data: ModalData) => void;
  closeModal: (modalId: ModalId) => void;
  getModalState: (modalId: ModalId) => boolean;
  getModalData: (modalId: ModalId) => ModalData | undefined;
}

const useModalStore = create<ModalState>((set, get) => ({
  activeModals: {},

  openModal: (modalId: ModalId, data: DeleteImageModalData | HelpModalData) =>
    set((state) => ({
      activeModals: {
        ...state.activeModals,
        [modalId]: {
          isOpen: true,
          data,
        },
      },
    })),

  closeModal: (modalId: ModalId) =>
    set((state) => ({
      activeModals: {
        ...state.activeModals,
        [modalId]: {
          isOpen: false,
          data: undefined,
        },
      },
    })),

  getModalState: (modalId: ModalId) =>
    get().activeModals[modalId]?.isOpen || false,

  getModalData: (modalId: ModalId) =>
    get().activeModals[modalId]?.data,
}));

export default useModalStore;
