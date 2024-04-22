import { useShallow } from 'zustand/react/shallow';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { MenuTab, useMenuStore } from '../../contexts/MenuStore';
import { useNotificationStore } from '../Notification/store';
import { MenuActionProps, MenuWithElementTitleProps } from '../../types/menu';
import { Accordion, Button } from 'react-bootstrap';

const DockActionsBar = () => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentMenu));
  console.log(menuCurrentTab);

  return (
    <div className="dockactionsbar">
      <div className="d-grid gap-2">
        {menuCurrentTab && (
          <>
            <SubmenuBar menus={menuCurrentTab.menus} />
            <ActionsBar actions={menuCurrentTab.actions} />
          </>
        )}
      </div>
    </div>
  );
};

type SubmenuBarProps = { menus: MenuTab[] };
const SubmenuBar = ({ menus }: SubmenuBarProps) => {
  return (
    <Accordion>
      {menus.map((menu, idx) => (
        <Accordion.Item eventKey={'' + idx}>
          <Accordion.Header>{menu.title}</Accordion.Header>
          <Accordion.Body>
            <ActionsBar actions={menu.actions} />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

type ActionsBarProps = { actions: MenuActionProps[] };
const ActionsBar = ({ actions }: ActionsBarProps) => {
  return actions.map((action) => {
    const key = '' + ((action as MenuWithElementTitleProps).name || (action.title as string));

    return action.draggable ? ( //
      <DraggableButton action={action} key={key} />
    ) : (
      <ActionButton action={action} key={key} />
    );
  });
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

export default DockActionsBar;
