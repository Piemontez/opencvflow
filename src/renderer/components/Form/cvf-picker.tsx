import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { toIlikeRegex } from 'renderer/commons/tools';
import { CVFOptionValue } from './index';

declare type PickerProps = {
  clearButton?: boolean;
  multi?: boolean;
  paginated?: boolean;
  //Cabeçalho da listagem
  header?: string[];
  //Itens
  options?: CVFOptionValue[];
  //Texts
  title?: string;
  subtitle?: string;
  footertitle?: string;
  placeholder?: boolean;
  addText?: boolean;
  //Callbacks
  onAdd?: (search: string) => void;
  onSel?: (value: any | null, row: any, event: any) => void;
};

export class CVFPicker<T = unknown> extends React.Component<T & PickerProps> {
  searchInput = React.createRef<HTMLInputElement>();
  state = {
    contents: [] as CVFOptionValue[],
    contentsBkp: [] as CVFOptionValue[],
    //Selecinado
    selected: [] as any[],
    selectedItems: [] as string[][],
    modalVisible: false,
    page: 0,
    count: 50,
    search: '',
    searchRegexps: [] as RegExp[],
  };

  componentDidMount() {
    if (this.props.options !== undefined) {
      this.setState({
        contents: this.props.options,
      });
    }

    if (this.state.modalVisible && this.search) {
      this.search();
    }
  }

  search?: () => void;

  /**
   * Troca para página anterior
   */
  handlePrevious = () => {
    let { page } = this.state;
    page--;
    this.setState({ page });

    if (this.search) {
      this.search();
    }
  };

  /**
   * Troca para próxima página
   */
  handleNext = () => {
    let { page } = this.state;
    page++;
    this.setState({ page });

    if (this.search) {
      this.search();
    }
  };

  close = () => {
    this.setState({
      modalVisible: false,
      search: '',
    });
  };

  toggle = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  show = () => {
    this.searchInput.current?.focus();

    if (this.search) {
      this.search();
    }

    this.setState({ modalVisible: true });
  };

  filter = (item: any) => {
    if (this.state.search === '') return true;

    const linha = (item.cols || []).join('');
    let contain = true;
    for (const regexp of this.state.searchRegexps) {
      contain = contain && regexp.test(linha);
    }
    return contain;
  };

  searchChange = (e: any) => {
    let state = this.state;
    state.search = e.target.value;
    state.searchRegexps = state.search
      .split(' ')
      .map((search) => toIlikeRegex(search) as RegExp);

    if (this.search) {
      this.setState(state);
      this.search();
    } else {
      if (!state.contentsBkp || !state.contentsBkp.length)
        state.contentsBkp = state.contents;

      state.contents = (state.contentsBkp || []).filter(this.filter);

      this.setState(state);
    }
  };

  static getDerivedStateFromProps(props: any, _state: any) {
    if (props.options !== undefined) {
      return {
        contents: props.options,
      };
    }
    return null;
  }

  setOptions = (options: CVFOptionValue[]) => {
    this.setState({
      contents: options,
    });
  };

  onSel = (value: any, item: string[], event: any) => {
    if (this.props.multi) {
      const { selected, selectedItems } = this.state;
      const pos = selected.findIndex((x: any) => x === value);
      if (pos > -1) {
        selected.splice(pos, 1);
        selectedItems.splice(pos, 1);
      } else {
        selected.push(value);
        selectedItems.push(item);
      }

      this.setState({
        selected,
        selectedItems,
      });
    } else {
      this.close();
      if (this.props.onSel) {
        this.props.onSel(value, item, event);
      }
    }
  };

  removeSer = (event: any) => {
    this.setState({
      selected: [],
      selectedItems: [],
    });
    this.close();
    if (this.props.onSel) {
      this.props.onSel(null, [], event);
    }
  };

  confirmSel = (event: any) => {
    this.close();
    if (this.props.onSel) {
      this.props.onSel(this.state.selected, this.state.selectedItems, event);
    }
  };

  render() {
    const {
      onAdd,
      addText,
      multi,
      header,
      title,
      subtitle,
      footertitle,
      placeholder,
    } = this.props;
    const { contents } = this.state;

    return (
      <Modal show={this.state.modalVisible} toggle={this.toggle}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '270px', paddingBottom: '10px' }}>
          {subtitle && <p>{subtitle}</p>}
          {placeholder !== false && (
            <Form.Group>
              <Form.Label>{placeholder || 'Search'}</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                defaultValue={this.state.search}
                onChange={this.searchChange}
                ref={this.searchInput}
              />
            </Form.Group>
          )}
          <p>
            <small>Click on the line to select the item.</small>
          </p>
          <div
            style={{
              minHeight: '200px',
              maxHeight: '300px',
              overflow: 'scroll',
            }}
          >
            <Table responsive>
              {header && (
                <thead>
                  <tr>
                    {header.map((head, key) => {
                      return <th key={key}>{head}</th>;
                    })}
                  </tr>
                </thead>
              )}
              <tbody>
                {contents.map((item, key) => {
                  const hasId = item.value.id !== undefined;
                  const selected = hasId
                    ? this.state.selected.findIndex(
                        (sel: any) => sel.id === item.value.id
                      ) !== -1
                    : this.state.selected.includes(item.value);
                  return (
                    <tr
                      key={key}
                      onClick={(event) =>
                        this.onSel(item.value, item.columns, event)
                      }
                    >
                      {item.columns.map((col, key) => {
                        return <td key={key}>{col}</td>;
                      })}
                      {multi && <td>{selected ? '✓' : ''}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        {footertitle && (
          <Modal.Footer>
            <small>{footertitle}</small>
          </Modal.Footer>
        )}
        <Modal.Footer>
          {this.props.clearButton && (
            <Button onClick={(e: any) => this.removeSer(e)}>
              Remove selection
            </Button>
          )}
          {onAdd && (
            <Button
              onClick={() => {
                this.close();
                onAdd(this.state.search);
              }}
              disabled={this.state.search.length < 3}
            >
              {addText || 'Add new'}
            </Button>
          )}
          <Button
            variant="warning"
            onClick={() => {
              this.close();
            }}
          >
            Close
          </Button>
          {multi && (
            <Button
              variant="primary"
              onClick={(e: any) => {
                this.confirmSel(e);
              }}
            >
              Select
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
