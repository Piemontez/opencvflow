import { CVFIOComponent } from 'renderer/types/component';

const tabName = 'ImgProc';

export class CVSobelComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Sobel' };
}
