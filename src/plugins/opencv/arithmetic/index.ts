import { CVFComponent } from 'renderer/types/component';

const tabName = 'Arithmetic';

export class CVPlusComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: '+' };
}
export class CVSubComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: '-' };
}
export class CVMultiplyComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: '*' };
}
export class CVDivComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: '/' };
}
export class CVMulComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: 'Mul' };
}
export class CVKernelComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: 'Kernel' };
}