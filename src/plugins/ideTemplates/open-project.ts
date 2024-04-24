import { ProjectTemplate } from '../../core/types/project-template';
import callOpenFileModal from '../../core/utils/callOpenFileModal';
import jsonToNodeStore from '../../core/utils/jsonToNodeStore';
import { loadFromJson } from '../../core/utils/loadFromJson';
import { useNewModalStore } from '../../ide/contexts/NewModalStore';
import { SaveContentLastVersion } from '../../ide/types/SaveContent';

const openFileProject = {
  group: 'Basic',
  title: 'Open File',

  onClick: () => {
    const onLoadFile = (evt: ProgressEvent<FileReader>) => {
      const content = '' + evt.target?.result || '{}';
      const json = JSON.parse(content);
      const jsonLoaded = jsonToNodeStore(json);
      const projectName = (jsonLoaded as SaveContentLastVersion).projectName;

      if (projectName) {
        useNewModalStore.getState().changeProjectName(projectName);
      }

      openFileProject.jsonLoaded = jsonLoaded;
    };

    callOpenFileModal({
      changeEvent: function () {
        if (this.files) {
          var fileReader = new FileReader();
          fileReader.onload = onLoadFile;
          fileReader.readAsText(this.files[0]);
        }
      },
      cancelEvent: () => {
        useNewModalStore.getState().changeTemplate(null);
      },
    });
  },

  action: () => {
    loadFromJson(openFileProject.jsonLoaded);
  },
} as ProjectTemplate & { jsonLoaded: any };

export default openFileProject;
