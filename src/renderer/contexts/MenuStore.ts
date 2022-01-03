import { observable, action, makeObservable } from 'mobx';
import { createContext } from 'react';
import { CVFComponent } from 'renderer/types/component';
import { MenuAction } from 'renderer/types/menu';
import { StringMap } from 'renderer/types/utils';

interface MenuStoreI {
  tabs: Array<MenuTab>;
  currentTab?: MenuTab;
  //Adiciona o menu ao navbar
  addComponentMenuAction(component: typeof CVFComponent): void;
  //Adiciona o menu ao navbar
  addMenuAction(action: MenuAction): void;
  //Modifica o menu que esta sendo exibido
  changeCurrentTab(tabOrTitle: MenuTab | string): void;
}

type MenuTab = {
  title: string;
  actions: MenuAction[];
};

class MenuStore {
  constructor() {
    makeObservable(this);
  }

  @observable tabs: Array<MenuTab> = [];
  @observable currentTab?: MenuTab;
  @observable actions: Array<MenuAction> = [];

  tabsByName: StringMap<MenuTab> = {};

  @action addMenuAction = (action: MenuAction) => {
    if (action) {
      const tab = this.findOrCreateTab(action.tabTitle);
      tab.actions.push(action);
      this.actions.push(action);
      console.log(this.findOrCreateTab(action.tabTitle).actions);
    }
  };

  @action addComponentMenuAction = (component: typeof CVFComponent) => {
    if (component.menu) {
      //Altera para o menu ser arrastável
      component.menu.draggable = true;

      const tab = this.findOrCreateTab(component.menu.tabTitle);
      tab.actions.push(component.menu);
      this.actions.push(component.menu);
    }
  };

  @action changeCurrentTab(tabOrTitle: MenuTab | string) {
    if (typeof tabOrTitle === 'string') {
      tabOrTitle = this.findOrCreateTab(tabOrTitle);
    }
    this.currentTab = tabOrTitle;
  }

  @action findOrCreateTab(tabTitle: string): MenuTab {
    if (this.tabsByName[tabTitle]) return this.tabsByName[tabTitle];
    const tab: MenuTab = {
      title: tabTitle,
      actions: [],
    };
    this.tabs.push(tab);
    this.tabsByName[tabTitle] = tab;
    return tab;
  }
}

const instance = new MenuStore() as MenuStoreI;

export default instance;
export const MenuStoreContext = createContext(instance);
