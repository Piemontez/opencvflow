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
  currentMenuWithSearch?: MenuTab; // Referência utilizada na busca

  search: string;

  onTypeSearch(search: string): void;
  onSearch(): void;
  cloneIfFound(menu: MenuTab): MenuTab | undefined;

  addMenuAction: (act: MenuActionProps) => void;
  addComponentMenuAction: (component: typeof CVFComponent) => void;
  changeCurrentTab: (tabOrTitle: MenuTab | string) => void;
  findOrCreateTab: (tabTitle: string[] | string | null, options: any) => MenuTab;
};

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [] as Array<MenuTab>,
  currentMenu: undefined as MenuTab | undefined,
  menusByName: {} as StringMap<MenuTab>,

  search: '',

  onTypeSearch(search: string) {
    get().search = search;
    get().onSearch();
  },

  onSearch() {
    set({
      currentMenuWithSearch: get().search //
        ? get().cloneIfFound(get().currentMenu!)
        : get().currentMenu,
    });
  },

  cloneIfFound(menu: MenuTab): MenuTab | undefined {
    const search = get().search;

    const submenus = [];
    for (const submenu of menu?.menus) {
      const foundMenu = get().cloneIfFound(submenu);
      if (foundMenu) {
        submenus.push(foundMenu);
      }
    }

    const actions = [];
    for (const action of menu.actions) {
      if (
        search
          .toLocaleLowerCase()
          .split(' ')
          .every((words) => ('' + action.title).toLocaleLowerCase().includes(words))
      ) {
        actions.push(action);
      }
    }

    if (submenus || actions) {
      return {
        title: menu.title,
        position: menu.position,
        dropdown: menu.dropdown,
        actions: actions,
        menus: submenus,
        menusByName: {},
      };
    }

    return undefined;
  },

  addMenuAction: (act: MenuActionProps) => {
    if (act) {
      const options = { position: act.position, dropdown: act.dropdown };

      const menu = get().findOrCreateTab(act.tabTitle || null, options);
      menu.actions.push(act);

      set({ menus: [...get().menus] });
    }
  },

  addComponentMenuAction: (component: typeof CVFComponent) => {
    if (component.menu) {
      // Altera para o menu ser arrastável
      component.menu.draggable = true;

      const menu = get().findOrCreateTab(component.menu.tabTitle || null, {});
      menu.actions.push(component.menu);

      if (menu.title === 'Inputs') {
        set({ currentMenu: menu, currentMenuWithSearch: menu });
      }

      set({ menus: [...get().menus] });
    }
  },

  changeCurrentTab: (tabOrTitle: MenuTab | string) => {
    const menu = typeof tabOrTitle === 'string' ? get().findOrCreateTab(tabOrTitle, {}) : tabOrTitle;
    set({
      //
      search: '',
      currentMenu: menu,
      currentMenuWithSearch: menu,
    });
  },

  findOrCreateTab: (tabTitle: string[] | string | null, options: any): MenuTab => {
    const isArray = Array.isArray(tabTitle);

    let titles = isArray ? [...tabTitle] : [tabTitle ?? 'ThirdParty'];
    let menu: null | MenuTab = null;
    let subtab: null | MenuTab = null;
    let hasNext = false;

    do {
      const title = titles.splice(0, 1)[0];
      hasNext = titles.length > 0;

      // Procura pra ver se já foi iniciado o menu
      if (!menu) {
        menu = get().menusByName[title];

        // Se não foi iniciado inicia o menu
        if (!menu) {
          menu = {
            title: title,
            position: options.position || 'left',
            dropdown: options.dropdown || false,
            actions: [],
            menus: [],
            menusByName: {},
          };

          get().menus.push(menu);
          get().menusByName[title] = menu;
        }
      } else {
        subtab = menu.menusByName[title];

        if (!subtab) {
          subtab = {
            title: title,
            position: options.position || 'left',
            dropdown: options.dropdown || false,
            actions: [],
            menus: [],
            menusByName: {},
          };

          menu.menus.push(subtab);
          menu.menusByName[title] = subtab;
        }

        menu = subtab;
      }
    } while (hasNext);

    return menu;
  },
}));
