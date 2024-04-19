import { useShallow } from 'zustand/react/shallow';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useMenuStore } from '../../contexts/MenuStore';
import { useNotificationStore } from '../Notification/store';
import { MenuActionProps, MenuWithElementTitleProps } from '../../types/menu';
import { Button } from 'react-bootstrap';

const ActionsBar = () => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentTab));

  return (
    <div className="dockactionsbar">
      <div className="d-grid gap-2">
        {menuCurrentTab?.actions.map((action) => {
          const key = '' + ((action as MenuWithElementTitleProps).name || (action.title as string));

          return action.draggable ? ( //
            <DraggableButton action={action} key={key} />
          ) : (
            <ActionButton action={action} key={key} />
          );
        })}
      </div>
    </div>
  );
};

type ButtonProps = { action: MenuActionProps };

const DraggableButton = ({ action }: ButtonProps) => {
  return (
    <Button
      size="sm"
      variant="transparent"
      onClick={() => {
        useNotificationStore.getState().info('Drag (with mouse) this menu and drop into the painel.');
      }}
      onDragStart={(event: any) => useNodeStore.getState().onDragStart(event, action)}
      draggable
    >
      {action.title as string}
    </Button>
  );
};

const ActionButton = ({ action }: ButtonProps) => {
  return (
    <Button size="sm" variant="transparent" onClick={action.action}>
      {action.title as string}
    </Button>
  );
};

export default ActionsBar;
