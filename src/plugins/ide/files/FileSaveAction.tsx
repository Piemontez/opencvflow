import { useNodeStore } from '../../../core/contexts/NodeStore';
import nodeStoreToJson from '../../../core/utils/nodeStoreToJson';
import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileSaveAction: MenuActionProps = {
  tabTitle: ['File'],
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon icon={'save'} /> Save
    </>
  ),
  action: () => {
    const json = nodeStoreToJson(useNodeStore.getState());
    const jsonString = JSON.stringify(json, null, 2);
    const file = new Blob([jsonString], { type: 'application/json' });

    // Others
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = `${json.projectName || 'nonamed'}.ocvflow.json`;

    document.body.appendChild(a);
    a.click();

    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  },
};

export default FileSaveAction;
