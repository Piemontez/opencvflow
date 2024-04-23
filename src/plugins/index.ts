import IDEPlugin from './ide';
import TensorFlowPlugin from './tensorflow';
import CustomPlugin from './custom';
import OpencvCVPlugin from './opencv';
import OpencvSamplesPlugin from './opencvSamples';

const plugins = [
  //
  IDEPlugin,
  TensorFlowPlugin,
  CustomPlugin,
  OpencvSamplesPlugin,
  OpencvCVPlugin,
];

export { plugins };
