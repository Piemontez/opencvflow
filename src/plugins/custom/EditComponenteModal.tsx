import { Button, Col, Modal, Row } from 'react-bootstrap';
import React, { createRef } from 'react';
import { CVFFormGroup } from 'renderer/components/Form';
import { PropertyType } from 'renderer/types/property';
import { tabName } from './index';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

loader.config({ monaco });

export class EditComponenteModal extends React.Component<any, any> {
  monacoRef: { current: monaco.editor.IStandaloneCodeEditor | null };

  constructor(props: any) {
    super(props);

    this.monacoRef = createRef<monaco.editor.IStandaloneCodeEditor>();
    this.state = {
      show: false,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleEditorWillMount = (m: typeof monaco) => {
    m.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      allowJs: true,
      isolatedModules: true,
    });
    m.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };
  handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    this.monacoRef.current = editor;
  };

  render() {
    const { name, show } = this.state;
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
                name="name"
                title="Component name"
                value={name}
                onChange={(name) => this.setState({ name })}
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
            defaultValue={defaultValue}
            beforeMount={this.handleEditorWillMount}
            onMount={this.handleEditorDidMount}
            options={{
              trimAutoWhitespace: false,
              renderWhitespace: 'all',
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close without save
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const defaultValue = `
import cv, { Mat } from 'opencv-ts';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { PropertyType } from 'renderer/types/property';
import GCStore from 'renderer/contexts/GCStore';

export class CustomComponent extends CVFComponent {
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];
  sources: SourceHandle[] = [
    { title: 'out', position: Position.Right }
  ];

  static processor = class CustomProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'iterations', type: PropertyType.Integer },
    ];
    iterations: number = 1;

    // Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
    async start() {}

    // Função chamada a cada novo ciclo de operação
    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, src2] = inputsAsMat;

      if (src1 && src2) {
        const out: Mat = new cv.Mat(src1.rows, src1.cols, src1.type(), new cv.Scalar(0) );
        GCStore.add(out);

        cv.subtract(src1, src2, out);

        this.output(out);
        this.sources = [out];
      }
    }

    // Função chamada antes de finalizar o processamento. Chamada uma única vez
    async stop() {}
  };
}
`;
