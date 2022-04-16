import { PluginType } from 'renderer/types/plugin';
import { CVFIOEndlessComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { EditComponenteModal } from './EditComponenteModal';

export const tabName = 'Custom Components';

const editCompRef = React.createRef<EditComponenteModal>();
const ECM6Fix = () => <EditComponenteModal ref={editCompRef} />;

const NewComponentAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'new',
  title: (
    <>
      <ECM6Fix />
      <span onClick={() => editCompRef.current?.handleShow()}>
        <FontAwesomeIcon className="text-info" icon={'plus'} /> new
      </span>
    </>
  ),
};

export class Custom02Component extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Custom 02' };
  static processor = class Custom01Processor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = src.clone();

          this.output(out);
          this.sources = [out];
        }
      }
    }
  };
}

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction, Custom02Component],
};

export default OpenCVPlugin;
