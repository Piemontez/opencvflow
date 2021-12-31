import { observable, action, computed, reaction } from 'mobx';
import { createContext } from 'react';
import { OCVFEdge } from 'renderer/types/edge';
import { OCVFNode } from 'renderer/types/node';
import { v4 as uuidv4 } from 'uuid';

export declare type FlowElement = OCVFNode | OCVFEdge;
export declare type Elements = Array<FlowElement>;

class NodeStore {
  constructor() {
    reaction(
      () => this.elements,
      (_) => console.log(this.elements.length)
    );
  }

  @observable elements: Elements = mockInitialElements;

  @action addNode = (node: OCVFNode) => {
    this.elements.push(node);
  };

  @action removeNode = (node: OCVFNode) => {
    //this.elements.push(node)
  };

  @action addEdge = (lnode: OCVFNode, rlnode: OCVFNode) => {
    //this.elements.push(todo)
  };

  @computed get nodes() {
    return this.elements.filter(() => false);
  }
  
  @computed get edges() {
    return this.elements.filter(() => false);
  }
}

export default createContext(new NodeStore());



const mockInitialElements: any /*Elements*/ = [
    {
      id: 'horizontal-1',
      sourcePosition: 'right',
      type: 'input',
      className: 'dark-node',
      data: { label: 'Input' },
      position: { x: 0, y: 80 },
    },
    {
      id: 'horizontal-2',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'A Node' },
      position: { x: 250, y: 0 },
    },
    {
      id: 'horizontal-3',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Node 3' },
      position: { x: 250, y: 160 },
    },
    {
      id: 'horizontal-4',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Node 4' },
      position: { x: 500, y: 0 },
    },
    {
      id: 'horizontal-5',
      sourcePosition: 'top',
      targetPosition: 'bottom',
      data: { label: 'Node 5' },
      position: { x: 500, y: 100 },
    },
    {
      id: 'horizontal-6',
      sourcePosition: 'bottom',
      targetPosition: 'top',
      data: { label: 'Node 6' },
      position: { x: 500, y: 230 },
    },
    {
      id: 'horizontal-7',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Node 7' },
      position: { x: 750, y: 50 },
    },
    {
      id: 'horizontal-8',
      sourcePosition: 'right',
      targetPosition: 'left',
      data: { label: 'Node 8' },
      position: { x: 750, y: 300 },
    },
  
    {
      id: 'horizontal-e1-2',
      source: 'horizontal-1',
      type: 'smoothstep',
      target: 'horizontal-2',
      animated: true,
    },
    {
      id: 'horizontal-e1-3',
      source: 'horizontal-1',
      type: 'smoothstep',
      target: 'horizontal-3',
      animated: true,
    },
    {
      id: 'horizontal-e1-4',
      source: 'horizontal-2',
      type: 'smoothstep',
      target: 'horizontal-4',
      label: 'edge label',
    },
    {
      id: 'horizontal-e3-5',
      source: 'horizontal-3',
      type: 'smoothstep',
      target: 'horizontal-5',
      animated: true,
    },
    {
      id: 'horizontal-e3-6',
      source: 'horizontal-3',
      type: 'smoothstep',
      target: 'horizontal-6',
      animated: true,
    },
    {
      id: 'horizontal-e5-7',
      source: 'horizontal-5',
      type: 'smoothstep',
      target: 'horizontal-7',
      animated: true,
    },
    {
      id: 'horizontal-e6-8',
      source: 'horizontal-6',
      type: 'smoothstep',
      target: 'horizontal-8',
      animated: true,
    },
  ];