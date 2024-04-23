import { useShallow } from 'zustand/react/shallow';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { MenuTab, useMenuStore } from '../../contexts/MenuStore';
import { useNotificationStore } from '../Notification/store';
import { MenuActionProps, MenuWithElementTitleProps } from '../../types/menu';
import { Accordion, Button } from 'react-bootstrap';

const DockActionsBar = () => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentMenu));

  return (
    <div className="dockactionsbar">
      <div className="actionsbar">
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
  if (!menus.length) {
    return null;
  }
  const ids = menus.map((_, idx) => '' + idx);
  return (
    <Accordion alwaysOpen defaultActiveKey={ids}>
      {menus.map((menu, key) => (
        <Accordion.Item eventKey={'' + key} key={key}>
          <Accordion.Header color="red">{menu.title}</Accordion.Header>
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
  return actions.map((action, idx) => {
    const key = '' + ((action as MenuWithElementTitleProps).name || (action.title as string) + idx);

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
