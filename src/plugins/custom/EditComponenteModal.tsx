import { Button, Col, Modal, Row } from 'react-bootstrap';
import React, { createRef } from 'react';
import { CVFFormGroup } from '../../ide/components/Form';
import { PropertyType } from '../../ide/types/PropertyType';
import { tabName } from './index';
//import * as monaco from 'monaco-editor';
//import Editor, { loader } from '@monaco-editor/react';
import CustomComponentStore from '../../ide/contexts/CustomComponentStore';
import { CustomNodeType } from '../../core/types/custom-node-type';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { useNodeStore } from '../../core/contexts/NodeStore';

//const RAW_LOADER_opencvts = require('!raw-loader!../../../node_modules/opencv-ts/src/opencv.d.ts');
//const RAW_LOADER_property = require('!raw-loader!../../renderer/types/property');
//const RAW_LOADER_gcstore = require('!raw-loader!../../renderer/contexts/GCStore');
//const RAW_LOADER_component = require('!raw-loader!../../renderer/types/component');
//const RAW_LOADER_node = require('!raw-loader!../../renderer/types/node');

//loader.config({ monaco });

export class EditComponenteModal extends React.Component<any, any> {
  //monacoRef: { current: monaco.editor.IStandaloneCodeEditor | null };

  constructor(props: any) {
    super(props);

    //this.monacoRef = createRef<monaco.editor.IStandaloneCodeEditor>();
    this.state = {
      show: false,
      name: '',
      title: '',
      code: defaultValue,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleNew = () => {
    this.setState({
      title: '',
      code: defaultValue,
    });
    this.handleShow();
  };

  handleEdit = (custom: CustomNodeType) => {
    this.setState({
      name: custom.name,
      title: custom.title,
      code: custom.code,
    });
    this.handleShow();
  };

  handleChangeTitle = (title: string) => {
    this.setState({ title });
  };

  handleSave = () => {
    const { title, code } = this.state;
    try {
      CustomComponentStore.validade({ title: title, code });
      CustomComponentStore.add({ title: title, code });
      useNodeStore.getState().storage();

      this.handleClose();
    } catch (ex) {
      useNotificationStore.getState().danger((ex as any).message);
      console.error((ex as any).message, ex);
    }
  };

  handleRemove = () => {
    const { name } = this.state;
    if (confirm('Do you want to remove this component?')) {
      CustomComponentStore.remove(name);
      useNodeStore.getState().storage();

      this.handleClose();
    }
  };

  /*handleEditorWillMount = (m: typeof monaco) => {
    const types: any = [
      { name: 'opencv-ts', default: RAW_LOADER_opencvts.default },
      { name: 'renderer/types/property', default: RAW_LOADER_property.default },
      {
        name: 'renderer/contexts/GCStore',
        default: RAW_LOADER_gcstore.default,
      },
      {
        name: 'renderer/types/component',
        default: RAW_LOADER_component.default,
      },
      { name: 'renderer/types/node', default: RAW_LOADER_node.default },
    ];

    types.forEach((module: any) => {
      m.languages.typescript.javascriptDefaults.addExtraLib(
        `declare module '${module.name}' {
         ${module.default}
        }`
      );
    });

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
  handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    this.monacoRef.current = editor;
  };*/

  render() {
    const { title, show, code } = this.state;
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
                value={title}
                onChange={this.handleChangeTitle}
              />
            </Col>
            <Col>
              <CVFFormGroup groupAs={Row} column={true} type={PropertyType.Text} disabled name="tabName" title="Tab Bar Menu" value={tabName} />
            </Col>
          </Row>
          {/* {show && (
            <Editor
              height="70vh"
              defaultLanguage="javascript"
              defaultValue={code}
              onChange={(value) => this.setState({ code: value })}
              beforeMount={this.handleEditorWillMount}
              onMount={this.handleEditorDidMount}
            />
          )} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.handleRemove}>
            Remove
          </Button>
          <div style={{ flex: 1 }} />
          <Button variant="secondary" onClick={this.handleClose}>
            Close without save
          </Button>
          <Button variant="primary" onClick={this.handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

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
