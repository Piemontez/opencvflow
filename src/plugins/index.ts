import IDEPlugin from './ide';
import OpencvCVPlugin from './opencv';
import TensorFlowPlugin from './tensorflow';
import CustomPlugin from './custom';
import SamplesPlugin from './samples';

const plugins = [
  //
  IDEPlugin,
  OpencvCVPlugin,
  TensorFlowPlugin,
  CustomPlugin,
  SamplesPlugin,
];

export { plugins };
