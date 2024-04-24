import callOpenFileModal from '../../../core/utils/callOpenFileModal';
import jsonToNodeStore from '../../../core/utils/jsonToNodeStore';
import { loadFromJson } from '../../../core/utils/loadFromJson';
import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileOpenAction: MenuActionProps = {
  tabTitle: ['File'],
  name: 'open',
  title: (
    <>
      <FontAwesomeIcon icon={'folder-open'} /> Open file
    </>
  ),
  action: () => {
    const onLoadFile = (evt: ProgressEvent<FileReader>) => {
      const content: any = evt.target?.result || '{}';
      const json = JSON.parse(content);
      const jsonLoaded = jsonToNodeStore(json);

      loadFromJson(jsonLoaded);
    };

    callOpenFileModal({
      changeEvent: function () {
        if (this.files) {
          var fileReader = new FileReader();
          fileReader.onload = onLoadFile;
          fileReader.readAsText(this.files[0]);
        }
      },
    });
  },
};

export default FileOpenAction;
