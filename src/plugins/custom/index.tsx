import { PluginType } from 'renderer/types/plugin';
// import cv, { Mat } from 'opencv-ts';
import { CVFIOEndlessComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';

const tabName = 'Custom Components';

export class Custom01Component extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Custom 01' };
  static processor = class Custom01Processor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = src.clone();

          this.output(out);
          this.sources = [out];
        }
      }
    }
  };
}

export class Custom02Component extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Custom 02' };
  static processor = class Custom01Processor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = src.clone();

          this.output(out);
          this.sources = [out];
        }
      }
    }
  };
}

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [Custom01Component, Custom02Component],
};

export default OpenCVPlugin;
