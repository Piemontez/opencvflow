import { create } from 'zustand';
import { CVFComponent } from '../types/component';
import { MenuActionProps } from '../types/menu';
import { StringMap } from '../types/utils';

type MenuTab = {
  title: string;
  position: 'left' | 'rigth';
  dropdown: boolean;
  actions: MenuActionProps[];
};

export const useMenuStore = create((set: any, get: any) => ({
  tabs: [] as Array<MenuTab>,
  currentTab: undefined as MenuTab | undefined,
  actions: [] as Array<MenuActionProps>,

  tabsByName: {} as StringMap<MenuTab>,

  addMenuAction: (act: MenuActionProps) => {
    if (act) {
      const options = { position: act.position, dropdown: act.dropdown };

      const tab = get().findOrCreateTab(act.tabTitle || null, options);
      tab.actions.push(act);

      get().actions.push(act);
    }
  },

  addComponentMenuAction: (component: typeof CVFComponent) => {
    if (component.menu) {
      // Altera para o menu ser arrastável
      component.menu.draggable = true;

      const tab = get().findOrCreateTab(component.menu.tabTitle || null, {});
      tab.actions.push(component.menu);
      get().actions.push(component.menu);

      if (tab.title === 'Inputs') {
        set({ currentTab: tab });
      }
    }
  },

  changeCurrentTab: (tabOrTitle: MenuTab | string) => {
    if (typeof tabOrTitle === 'string') {
      set({ currentTab: get().findOrCreateTab(tabOrTitle, {}) });
    } else {
      set({ currentTab: tabOrTitle });
    }
  },

  findOrCreateTab: (tabTitle: string | null, options: any): MenuTab => {
    tabTitle = tabTitle ?? 'ThirdParty';
    if (get().tabsByName[tabTitle]) {
      return get().tabsByName[tabTitle];
    }
    const tab: MenuTab = {
      title: tabTitle,
      position: options.position || 'left',
      dropdown: options.dropdown || false,
      actions: [],
    };
    get().tabs.push(tab);

    return (get().tabsByName[tabTitle] = get().tabs[get().tabs.length - 1]);
  },
}));
