import { action, makeObservable, observable } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import moment from 'moment';
import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

type NotificationProps = {
  id: string;
  className?: string;
  title: string;
  message: string;
  detail?: string;
  createdAt: Date;
};

export class NotificationCtrl {
  @observable alerts: NotificationProps[] = [];
  @observable amount: number = 0;

  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  @action
  showAll() {
    this.amount = 0;
    this.alerts.forEach((a) => {
      a.id = Math.random().toString(32);
    });
  }

  @action
  success = (message: string, title?: string) => {
    this.amount++;
    this.alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-success text-white',
      title: title || 'Success',
      message,
      createdAt: new Date(),
    });
  };

  @action
  warn = (message: string, title?: string, detail?: string) => {
    this.amount++;
    this.alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-warning',
      title: title || 'Warning',
      message,
      detail,
      createdAt: new Date(),
    });
  };

  @action
  danger = (message: string, title?: string) => {
    this.amount++;
    this.alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-danger text-white',
      title: title || 'Error',
      message,
      createdAt: new Date(),
    });
  };

  @action
  info = (message: string, title?: string) => {
    this.amount++;
    this.alerts.unshift({
      id: Math.random().toString(32),
      className: 'bg-info text-white',
      title: title || 'Info',
      message,
      createdAt: new Date(),
    });
  };
}

function Notification({
  title,
  message,
  createdAt,
  className,
  detail,
}: NotificationProps) {
  const [show, setShow] = useState(true);
  const isError = className?.includes('bg-danger') || false;
  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={isError ? 7000 : 5000}
      autohide
    >
      <Toast.Header className={className}>
        <strong className="mr-auto">{title}</strong>
        &nbsp;&nbsp;
        <small>{moment(createdAt).format('L LT')}</small>
      </Toast.Header>
      <Toast.Body style={{ whiteSpace: 'pre-wrap' }}>
        <strong>{message}</strong>
      </Toast.Body>
      {!!detail && <Toast.Body>Detail: {detail}</Toast.Body>}
    </Toast>
  );
}

/**
 * Barra do topo com as funções da listagem
 */
@inject('ctrl')
@observer
class NotificationList extends React.Component<{ ctrl?: NotificationCtrl }> {
  render() {
    const { ctrl } = this.props;
    return (
      // TODO: Criar css para as notificações
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'relative', zIndex: 1100 }}
      >
        <div style={{ position: 'fixed', top: 45, right: 10 }}>
          {ctrl!.alerts.map((alert) => (
            <Notification key={alert.id} {...alert} />
          ))}
        </div>
      </div>
    );
  }
}

/**
 * Controlador das notificações
 */
export const notify = new NotificationCtrl();

const NotificationProvider = () => {
  return (
    <Provider ctrl={notify}>
      <NotificationList />
    </Provider>
  );
};

export default NotificationProvider;
