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

    const onChoseFile = () => {
      if (f.files) {
        var fileReader = new FileReader();
        fileReader.onload = onLoadFile;
        fileReader.readAsText(f.files[0]);
      }
    };

    const f = document.createElement('input');
    f.style.display = 'none';
    f.type = 'file';
    f.name = 'file';
    f.addEventListener('change', onChoseFile);

    document.getElementById('root')!.appendChild(f);
    f.click();
  },
};

export default FileOpenAction;
