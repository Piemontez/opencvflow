import IDEPlugin from './ide';
import IDETemplatesPlugin from './ideTemplates';
import OpencvCVPlugin from './opencv';
import OpenCVTemplatesPlugin from './opencvTemplates';
import CustomPlugin from './custom';
import TensorFlowPlugin from './tensorflow';

const plugins = [
  //
  IDEPlugin,
  IDETemplatesPlugin,
  TensorFlowPlugin,
  OpenCVTemplatesPlugin,
  OpencvCVPlugin,
  CustomPlugin,
];

export { plugins };
