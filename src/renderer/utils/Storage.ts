/**
 * Armazenador (storage) local de dados
 */
class Stg {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  clear() {
    this.storage.clear();
  }

  getItem(key: string, def: any = null): any {
    const property = this.storage.getItem(key);
    try {
      return ![undefined, null, 'null'].includes(property)
        ? JSON.parse(property!).v
        : def;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: any) {
    return this.storage.setItem(key, JSON.stringify({ v: value }));
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  key(index: number) {
    return this.storage.key(index);
  }

  set(path: string, key: string, value: any) {
    this.setItem(`${path}/${key}`, value);
  }

  get(path: string, key: string, def: any = null) {
    return this.getItem(`${path}/${key}`, def);
  }
}

const Storage = new Stg();
export default Storage;
