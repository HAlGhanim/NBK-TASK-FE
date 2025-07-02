export enum ToastType {
  success = 'SUCCESS',
  error = 'ERROR',
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}
