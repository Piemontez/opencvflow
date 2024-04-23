import { Button, Col, Modal, Row } from 'react-bootstrap';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CVFFormGroup } from '../../ide/components/Form';
import { PropertyType } from '../../ide/types/PropertyType';
import { tabName } from './index';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import { useCustomComponentStore } from '../../ide/contexts/CustomComponentStore';
import { CustomNodeType } from '../../core/types/custom-node-type';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { useNodeStore } from '../../core/contexts/NodeStore';

//import type RAW_LOADER_property from '../../ide/types/PropertyType';
//import type RAW_LOADER_opencvts from '../../../node_modules/opencv-ts/src/opencv.d.ts';
//import * as RAW_LOADER_property from '../../ide/types/PropertyType';
//import * as RAW_LOADER_component from '../../ide/types/component';
//import * as RAW_LOADER_node from '../../core/types/node';
//import * as RAW_LOADER_gcstore from '../../core/contexts/GCStore';

//loader.config({ monaco });
loader.config({});

type EditComponenteModal = {
  handleNew: () => void;
  handleEdit: (custom: CustomNodeType) => void;
};

const EditComponenteModal = forwardRef<EditComponenteModal, {}>((_, ref) => {
  const monacoRef = useRef(null);
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({ name: '', title: '', code: defaultValue } as CustomNodeType);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNew = () => {
    setContent({
      name: content.name,
      title: '',
      code: defaultValue,
    });
    handleShow();
  };

  const handleEdit = (custom: CustomNodeType) => {
    setContent({
      name: custom.name,
      title: custom.title,
      code: custom.code,
    });
    handleShow();
  };

  const handleChangeTitle = (title: string) => {
    setContent({ ...content, title });
  };

  const handleSave = () => {
    const { title, code } = content;
    try {
      useCustomComponentStore.getState().validade({ title: title, code });
      useCustomComponentStore.getState().add({ title: title, code });
      useNodeStore.getState().storage();

      handleClose();
    } catch (ex) {
      useNotificationStore.getState().danger((ex as any).message);
      console.error((ex as any).message, ex);
    }
  };

  const handleRemove = () => {
    const { name } = content;
    if (confirm('Do you want to remove this component?')) {
      useCustomComponentStore.getState().remove(name!);
      useNodeStore.getState().storage();

      handleClose();
    }
  };

  const handleEditorBeforeMount = (m: Monaco) => {
    /*const types: any = [
      //{ name: 'opencv-ts', default: RAW_LOADER_opencvts },
      { name: 'renderer/types/property', default: RAW_LOADER_property },
      { name: 'renderer/contexts/GCStore', default: RAW_LOADER_gcstore },
      { name: 'renderer/types/component', default: RAW_LOADER_component },
      { name: 'renderer/types/node', default: RAW_LOADER_node },
    ];*/

    /*types.forEach((module: any) => {
      m.languages.typescript.javascriptDefaults.addExtraLib(
        `declare module '${module.name}' {
         ${module.default}
        }`,
      );
    });*/

    m.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
      //noLib: true,
      //isolatedModules: true,
      //target: monaco.languages.typescript.ScriptTarget.ES2015,
      //moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      //module: monaco.languages.typescript.ModuleKind.CommonJS,
    });
    m.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleEditorDidMount = (editor: any, _: Monaco) => {
    monacoRef.current = editor;
  };

  useImperativeHandle(ref, () => ({
    handleNew,
    handleEdit,
  }));

  return (
    <Modal show={show} size="xl">
      <Modal.Header>
        <Modal.Title>New Component</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <CVFFormGroup
              groupAs={Row}
              column={true}
              type={PropertyType.Text}
              name={'title'}
              title="Component name"
              value={content.title}
              onChange={handleChangeTitle}
            />
          </Col>
          <Col>
            <CVFFormGroup groupAs={Row} column={true} type={PropertyType.Text} disabled name="tabName" title="Tab Bar Menu" value={tabName} />
          </Col>
        </Row>
        {show && (
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            defaultValue={content.code}
            onChange={(value) => setContent({ ...content, code: value || '' })}
            beforeMount={handleEditorBeforeMount}
            onMount={handleEditorDidMount}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleRemove}>
          Remove
        </Button>
        <div style={{ flex: 1 }} />
        <Button variant="secondary" onClick={handleClose}>
          Close without save
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

const defaultValue = `
import cv from 'opencv-ts';
import { CVFComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import { PropertyType } from 'renderer/types/property';
import GCStore from 'renderer/contexts/GCStore';

class CustomComponent extends CVFComponent {
  static processor = class CustomProcessor extends CVFNodeProcessor {
    // Função chamada a cada novo ciclo de operação
    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length < 2) {
        this.sources = [];
        return;
      }

      const [src1, src2] = inputsAsMat;

      if (src1 && src2) {
        const out = new cv.Mat(src1.rows, src1.cols, cv.CV_8UC3, new cv.Scalar(0));
        GCStore.add(out);

        for (let j = src1.rows - 1; j > -1; j--) {
          for (let k = src1.cols - 1; k > -1; k--) {
            const value1 = src1.ptr(j, k);
            const value2 = src2.ptr(j, k);

            out.ucharPtr(j,k)[0] = (value1[0] + value2[0]) / 2;
            out.ucharPtr(j,k)[1] = (value1[1] + value2[1]) / 2;
            out.ucharPtr(j,k)[2] = (value1[2] + value2[2]) / 2;
          }
        }

        this.output(out);
        this.sources = [out];
      }
    }

    // Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
    async start() {}


    // Função chamada antes de finalizar o processamento. Chamada uma única vez
    async stop() {}

    // Propriedades a serem exibidas e manipuladas via menu.
    /*properties = [
      { name: 'iterations', type: PropertyType.Integer },
    ];
    iterations = 1;*/
  };

  targets = [
    { title: 'src1', position: 'left' },
    { title: 'src2', position: 'left' },
  ];
  sources = [
    { title: 'out', position: 'right' }
  ];
}`;

export default EditComponenteModal;
