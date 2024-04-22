import { create } from 'zustand';
import { CVFComponent } from '../types/component';
import { MenuActionProps } from '../types/menu';
import { StringMap } from '../types/StringMap';

export type MenuTab = {
  title: string;
  position: 'left' | 'rigth';
  dropdown: boolean;
  actions: MenuActionProps[];
  menus: MenuTab[];
  menusByName: StringMap<MenuTab>;
};

type MenuState = {
  menus: Array<MenuTab>;
  menusByName: StringMap<MenuTab>;
  currentMenu?: MenuTab;

  addMenuAction: (act: MenuActionProps) => void;
  addComponentMenuAction: (component: typeof CVFComponent) => void;
  changeCurrentTab: (tabOrTitle: MenuTab | string) => void;
  findOrCreateTab: (tabTitle: string[] | string | null, options: any) => MenuTab;
};

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [] as Array<MenuTab>,
  currentMenu: undefined as MenuTab | undefined,

  menusByName: {} as StringMap<MenuTab>,

  addMenuAction: (act: MenuActionProps) => {
    if (act) {
      const options = { position: act.position, dropdown: act.dropdown };

      const tab = get().findOrCreateTab(act.tabTitle || null, options);
      tab.actions.push(act);

      set({ menus: [...get().menus] });
    }
  },

  addComponentMenuAction: (component: typeof CVFComponent) => {
    if (component.menu) {
      // Altera para o menu ser arrastável
      component.menu.draggable = true;

      const tab = get().findOrCreateTab(component.menu.tabTitle || null, {});
      tab.actions.push(component.menu);

      if (tab.title === 'Inputs') {
        set({ currentMenu: tab });
      }

      set({ menus: [...get().menus] });
    }
  },

  changeCurrentTab: (tabOrTitle: MenuTab | string) => {
    if (typeof tabOrTitle === 'string') {
      set({ currentMenu: get().findOrCreateTab(tabOrTitle, {}) });
    } else {
      set({ currentMenu: tabOrTitle });
    }
  },

  findOrCreateTab: (tabTitle: string[] | string | null, options: any): MenuTab => {
    const isArray = Array.isArray(tabTitle);

    let titles = isArray ? [...tabTitle] : [tabTitle ?? 'ThirdParty'];
    let tab: null | MenuTab = null;
    let subtab: null | MenuTab = null;
    let hasNext = false;

    do {
      const title = titles.splice(0, 1)[0];
      hasNext = titles.length > 0;

      // Procura pra ver se já foi iniciado o menu
      if (!tab) {
        tab = get().menusByName[title];

        // Se não foi iniciado inicia o menu
        if (!tab) {
          tab = {
            title: title,
            position: options.position || 'left',
            dropdown: options.dropdown || false,
            actions: [],
            menus: [],
            menusByName: {},
          };

          get().menus.push(tab);
          get().menusByName[title] = tab;
        }
      } else {
        subtab = tab.menusByName[title];

        if (!subtab) {
          subtab = {
            title: title,
            position: options.position || 'left',
            dropdown: options.dropdown || false,
            actions: [],
            menus: [],
            menusByName: {},
          };

          tab.menus.push(subtab);
          tab.menusByName[title] = subtab;
        }

        tab = subtab;
      }
    } while (hasNext);

    return tab;
  },
}));
