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
  DELETE_IMAGE = 'delete_image',
  HELP = 'help'
}

interface ModalData {
  type: ModalId;
  data: Record<string, any>;
}

interface ModalState {
  activeModal: ModalId | null;
  modalData: ModalData | null;
  openModal: (id: ModalId, data: ModalData) => void;
  closeModal: () => void;
  isOpen: (id: ModalId) => boolean;
}

const useModalStore = create<ModalState>((set, get) => ({
  activeModal: null,
  modalData: null,
  openModal: (id, data) => set({ activeModal: id, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  isOpen: (id) => get().activeModal === id
}));

export default useModalStore;
