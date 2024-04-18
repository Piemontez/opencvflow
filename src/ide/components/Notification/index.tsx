import moment from 'moment';
import { useState } from 'react';
import { Toast } from 'react-bootstrap';
import { NotificationProps, useNotificationStore } from './store';

function Notification({ title, message, createdAt, className, detail }: NotificationProps) {
  const [show, setShow] = useState(true);
  const isError = className?.includes('bg-danger') || false;
  return (
    <Toast onClose={() => setShow(false)} show={show} delay={isError ? 7000 : 5000} autohide>
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
const NotificationList = () => {
  const alerts = useNotificationStore((state) => state.alerts);

  return (
    // TODO: Criar css para as notificações
    <div aria-live="polite" aria-atomic="true" style={{ position: 'relative', zIndex: 1100 }}>
      <div style={{ position: 'fixed', top: 45, right: 10 }}>
        {alerts.map((alert) => (
          <Notification key={alert.id} {...alert} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
