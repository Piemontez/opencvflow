import { CVFComponent } from 'renderer/types/component';

const tabName = 'Arithmetic';

export class CVPlusComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: '+' };
}
export class CVSubComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: '-' };
}
export class CVMultiplyComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: '*' };
}
export class CVDivComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: '/' };
}
export class CVMulComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Mul' };
}
export class CVKernelComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Kernel' };
}