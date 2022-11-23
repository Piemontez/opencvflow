import { observable, action, makeObservable } from 'mobx';
import { createContext } from 'react';
import { CVFComponent } from 'renderer/types/component';
import { MenuActionProps } from 'renderer/types/menu';
import { StringMap } from 'renderer/types/utils';

interface MenuStoreI {
  tabs: Array<MenuTab>;
  currentTab?: MenuTab;
  // Adiciona o menu ao navbar
  addComponentMenuAction(component: typeof CVFComponent): void;
  // Adiciona o menu ao navbar
  addMenuAction(action: MenuActionProps): void;
  // Modifica o menu que esta sendo exibido
  changeCurrentTab(tabOrTitle: MenuTab | string): void;
}

type MenuTab = {
  title: string;
  position: 'left' | 'rigth';
  dropdown: boolean;
  actions: MenuActionProps[];
};

class MenuStore {
  constructor() {
    makeObservable(this);
  }

  @observable tabs: Array<MenuTab> = [];
  @observable currentTab?: MenuTab;
  @observable actions: Array<MenuActionProps> = [];

  tabsByName: StringMap<MenuTab> = {};

  @action addMenuAction = (act: MenuActionProps) => {
    if (act) {
      const options = { position: act.position, dropdown: act.dropdown };
      const tab = this.findOrCreateTab(act.tabTitle || null, options);
      tab.actions.push(act);
      this.actions.push(act);
    }
  };

  @action addComponentMenuAction = (component: typeof CVFComponent) => {
    if (component.menu) {
      // Altera para o menu ser arrastável
      component.menu.draggable = true;

      const tab = this.findOrCreateTab(component.menu.tabTitle || null, {});
      tab.actions.push(component.menu);
      this.actions.push(component.menu);

      if (tab.title === 'Inputs') {
        this.currentTab = tab;
      }
    }
  };

  @action changeCurrentTab(tabOrTitle: MenuTab | string) {
    if (typeof tabOrTitle === 'string') {
      this.currentTab = this.findOrCreateTab(tabOrTitle, {});
    } else {
      this.currentTab = tabOrTitle;
    }
  }

  @action findOrCreateTab(tabTitle: string | null, options: any): MenuTab {
    tabTitle = tabTitle ?? 'ThirdParty';
    if (this.tabsByName[tabTitle]) {
      return this.tabsByName[tabTitle];
    }
    const tab: MenuTab = {
      title: tabTitle,
      position: options.position || 'left',
      dropdown: options.dropdown || false,
      actions: [],
    };
    this.tabs.push(tab);

    this.tabsByName[tabTitle] = this.tabs[this.tabs.length - 1];
    return this.tabsByName[tabTitle];
  }
}

const instance = new MenuStore() as MenuStoreI;

export default instance;
export const MenuStoreContext = createContext(instance);
