class Bootloader {
  PROGRESSBAR_TAGID = 'progressbar';
  ASSETSLIST_TAGID = 'assetslist';

  assets = [];
  el = {
    assetslist: null,
    progres: null,
    assets: {}, // { [id]: {li:null, badge:null} }
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
    this.updateProgress(10, 11);
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

  load = () => {
    console.log(this);
  };
}

function bootstrap() {
  const boot = new Bootloader(window.$bootloader);
  boot.init();
  boot.makeDisplay();
  boot.load();
}

window.addEventListener('load', bootstrap);
