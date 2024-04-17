import { CustomComponent } from './custom-component';
import { OCVElements } from './ocv-elements';

export type SaveContent = {
  custom: {
    components: Array<CustomComponent>;
  };
  elements: OCVElements;
};
