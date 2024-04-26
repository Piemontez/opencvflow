class Bootloader {
  PROGRESSBAR_TAGID = 'progressbar';
  ASSETSLIST_TAGID = 'assetslist';

  assetsGroups = []; // [ [group, [assets] ] ]
  assets = []; // [string]
  el = {
    assetslist: null,
    progres: null,
    assets: {}, // { [id]: {li, badge} }
  };
  progressbar = {
    loaded: 0,
    totalSize: 1,
    el: null,
  };

  constructor(assetsGroups) {
    this.assetsGroups = assetsGroups;
  }

  init = () => {
    this.assets = this.assetsGroups //
      .map(([_group, assets]) => assets)
      .flat();

    this.el.assetslist = document.getElementById(this.ASSETSLIST_TAGID);
    this.el.progres = document.getElementById(this.PROGRESSBAR_TAGID);
  };

  destroyRefs = () => {
    this.assets = [];
    this.el = {};
    this.progressbar = {};
  };

  getAssetId = (asset) => {
    return asset.replace(/[ \\\/"'<>`.]*/g, '');
  };

  /**
   * Cria o painel progresso
   */
  makeDisplay = () => {
    for (const asset of this.assets) {
      this.makeAssetsTag(asset);
    }
  };

  makeAssetsTag = (asset) => {
    asset = asset //
      .replace(/\..*/, '') // Remove extenção arquivo
      .replace(/\/[^\/]*\//, ''); // Remove pasta do arquivo

    const id = this.getAssetId(asset);

    const li = document.createElement('li');
    li.id = id;
    li.classList = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = id;

    const badge = document.createElement('span');
    badge.classList = 'badge badge-primary';
    badge.innerHTML = '0';
    li.appendChild(badge);

    this.el.assetslist.appendChild(li);

    this.el.assets[id] = { li, badge };
  };

  updateProgress = (loaded, totalSize) => {
    this.el.progres.setAttribute('value', loaded.toString());
    this.el.progres.setAttribute('max', totalSize.toString());
  };

  updateAssetProgress = (asset, bitsLoaded) => {
    const id = this.getAssetId(asset);
    this.el.assets[id].badge.innerHTML = '' + bitsLoaded;
  };

  load = () => {
    for (const [group, assets] of this.assetsGroups) {
      for (const asset of assets) {
        if (group === 'js') this.loadJs(asset);
        if (group === 'module') this.loadModule(asset);
      }
    }
  };

  loadJs = (asset) => {
    console.log('js', asset);
  };

  loadModule = (asset) => {
    console.log('module', asset);
  };
}

function bootstrap() {
  const boot = new Bootloader(window.$bootloader);
  boot.init();
  boot.makeDisplay();
  boot.load();

  //Test
  boot.updateProgress(10, 11);
  boot.updateAssetProgress('monacoeditor', 123);
  boot.updateAssetProgress('opencvts', 1235);
}

window.addEventListener('load', bootstrap);
