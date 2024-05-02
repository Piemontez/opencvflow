import IDEPlugin from './ide';
import IDETemplatesPlugin from './ideTemplates';
import OpencvCVPlugin from './opencv';
import OpenCVTemplatesPlugin from './opencvTemplates';
import CustomPlugin from './custom';
import TensorFlowPlugin from './tensorflow';
import UtilsCVPlugin from './utils';

const plugins = [
  //
  IDEPlugin,
  IDETemplatesPlugin,
  TensorFlowPlugin,
  OpenCVTemplatesPlugin,
  OpencvCVPlugin,
  UtilsCVPlugin,
  CustomPlugin,
];

export { plugins };
