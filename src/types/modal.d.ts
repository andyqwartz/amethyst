export interface DeleteImageModalData {
  imageId?: string;
  imageUrl: string;
}

export interface HelpModalData {
  title?: string;
  content?: string;
}

export type ModalData = DeleteImageModalData | HelpModalData;