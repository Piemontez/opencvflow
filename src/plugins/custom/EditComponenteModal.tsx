import { Button, Col, Modal, Row } from 'react-bootstrap';
import React, { createRef } from 'react';
import { CVFFormGroup } from 'renderer/components/Form';
import { PropertyType } from 'renderer/types/property';
import { tabName } from './index';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
import CustomComponentStore from 'renderer/contexts/CustomComponentStore';
import { notify } from 'renderer/components/Notification';

const RAW_LOADER_opencvts = require('!raw-loader!../../../node_modules/opencv-ts/src/opencv.d.ts');
const RAW_LOADER_property = require('!raw-loader!../../renderer/types/property');
const RAW_LOADER_gcstore = require('!raw-loader!../../renderer/contexts/GCStore');
const RAW_LOADER_component = require('!raw-loader!../../renderer/types/component');
const RAW_LOADER_node = require('!raw-loader!../../renderer/types/node');

loader.config({ monaco });

export class EditComponenteModal extends React.Component<any, any> {
  monacoRef: { current: monaco.editor.IStandaloneCodeEditor | null };

  constructor(props: any) {
    super(props);

    this.monacoRef = createRef<monaco.editor.IStandaloneCodeEditor>();
    this.state = {
      show: false,
      name: '',
      code: defaultValue,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleChangeName = (name: string) => {
    this.setState({ name });
  };

  handleSave = () => {
    const { name, code } = this.state;
    try {
      CustomComponentStore.validade({ name, code });
      CustomComponentStore.add({ name, code });
    } catch (ex) {
      notify.danger((ex as any).message);
      console.error((ex as any).message, ex);
    }
  };

  handleEditorWillMount = (m: typeof monaco) => {
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
  };

  render() {
    const { name, show, code } = this.state;
    return (
      <Modal show={show} onHide={this.handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>New Component</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <CVFFormGroup
                groupAs={Row}
                column={true}
                type={PropertyType.Text}
                name={name}
                title="Component name"
                value={name}
                onChange={this.handleChangeName}
              />
            </Col>
            <Col>
              <CVFFormGroup
                groupAs={Row}
                column={true}
                type={PropertyType.Text}
                disabled
                name="name"
                title="Tab Bar Menu"
                value={tabName}
              />
            </Col>
          </Row>
          <Editor
            height="70vh"
            defaultLanguage="javascript"
            defaultValue={code}
            onChange={(value) => this.setState({ code: value })}
            beforeMount={this.handleEditorWillMount}
            onMount={this.handleEditorDidMount}
          />
        </Modal.Body>
        <Modal.Footer>
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
    static properties = [
      { name: 'iterations', type: PropertyType.Integer },
    ];
    iterations = 1;

    // Função chamada a cada novo ciclo de operação
    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, src2] = inputsAsMat;

      if (src1 && src2) {
        const out/*: Mat*/ = new cv.Mat(src1.rows, src1.cols, src1.type(), new cv.Scalar(0) );
        GCStore.add(out);

        cv.subtract(src1, src2, out);

        this.output(out);
        this.sources = [out];
      }
    }

    // Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
    async start() {}


    // Função chamada antes de finalizar o processamento. Chamada uma única vez
    async stop() {}
  };

  targets = [
    { title: 'src1', position: 'left' },
    { title: 'src2', position: 'left' },
  ];
  sources = [
    { title: 'out', position: 'right' }
  ];
}`;
