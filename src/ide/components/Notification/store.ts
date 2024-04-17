import { create } from 'zustand';

export type NotificationProps = {
  id: string;
  className?: string;
  title: string;
  message: string;
  detail?: string;
  createdAt: Date;
};

export const useNotificationStore = create((set: any, get: any) => ({
  alerts: [] as NotificationProps[],
  amount: 0 as number,

  showAll: () => {
    set({
      amount: 0,
      alerts: get().alerts.map((a: any) => ({
        ...a,
        id: Math.random().toString(32),
      })),
    });
  },

  success: (message: string, title?: string) => {
    get().alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-success text-white',
      title: title || 'Success',
      message,
      createdAt: new Date(),
    });
    set({
      amount: get().amount++,
      alerts: get().alerts,
    });
  },

  warn: (message: string, title?: string, detail?: string) => {
    get().alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-warning',
      title: title || 'Warning',
      message,
      detail,
      createdAt: new Date(),
    });
    set({
      amount: get().amount++,
      alerts: get().alerts,
    });
  },

  danger: (message: string, title?: string) => {
    get().alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-danger text-white',
      title: title || 'Error',
      message,
      createdAt: new Date(),
    });
    set({
      amount: get().amount++,
      alerts: get().alerts,
    });
  },

  info: (message: string, title?: string) => {
    get().alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-info text-white',
      title: title || 'Info',
      message,
      createdAt: new Date(),
    });
    set({
      amount: get().amount++,
      alerts: get().alerts,
    });
  },
}));
