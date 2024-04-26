const getBlob = (asset, progressCB, successCB, errorCB) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', asset.file, true);
  xhr.responseType = 'blob';

  xhr.onreadystatechange = function () {
    var clength = xhr.getResponseHeader('Content-Length');
    if (clength && !asset.size) {
      progressCB(asset, null, parseInt(clength));
    }
  };

  //set listeners
  xhr.addEventListener('error', (event) => errorCB(asset, xhr), false);
  xhr.addEventListener(
    'progress',
    function (event) {
      if (event.lengthComputable) {
        //progressCB(asset, event.loaded);
      }
    },
    false,
  );
  xhr.addEventListener(
    'load',
    function (event) {
      var status = xhr.status;
      if (status === 200 || (status === 0 && xhr.response)) {
        //progressCB(asset, asset.size);
        successCB(asset, xhr.response);
      } else {
        errorCB(asset, xhr);
      }
    },
    false,
  );
  xhr.send();
};

class Bootloader {
  TYPE_JS = 'js';
  TYPE_MODULE = 'module';
  PROGRESSBAR_TAGID = 'progressbar';
  ASSETSLIST_TAGID = 'assetslist';

  assetsGroups = []; // [ [group, [assets] ] ]
  assets = []; // [{id, group, assets, size, totalSize}]
  el = {
    assetslist: null,
    progres: null,
    assets: {}, // { [id]: {li, badge} }
  };
  progressbar = {
    loaded: 0,
    size: 1,
    el: null,
  };

  constructor(assetsGroups) {
    this.assetsGroups = assetsGroups;
  }

  init = () => {
    this.assets = this.assetsGroups //
      .map(([group, assets]) =>
        assets.map((asset) => ({
          //
          id: this.getAssetId(asset),
          group,
          path: asset,
          size: 0,
          totalSize: 0,
        })),
      )
      .flat();

    this.el.assetslist = document.getElementById(this.ASSETSLIST_TAGID);
    this.el.progres = document.getElementById(this.PROGRESSBAR_TAGID);
  };

  destroyRefs = () => {
    this.assets = [];
    this.el = {};
    this.progressbar = {};
  };

  getAssetId = (path) => {
    return path
      .replace(/\..*/, '') // Remove extenção arquivo
      .replace(/\/[^\/]*\//, '') // Remove pasta do arquivo
      .replace(/[ \\\/"'<>`.]*/g, '');
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
    const li = document.createElement('li');
    li.id = asset.id;
    li.classList = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = asset.id;

    const badge = document.createElement('span');
    badge.classList = 'badge badge-primary';
    badge.innerHTML = '0';
    li.appendChild(badge);

    this.el.assetslist.appendChild(li);

    this.el.assets[asset.id] = { li, badge };
  };

  updateProgress = () => {
    this.el.progres.setAttribute('value', this.progressbar.loaded.toString());
    this.el.progres.setAttribute('max', this.progressbar.size.toString());
  };

  updateAssetSize = (asset, loaded, totalSize) => {
    if (loaded) {
      console.log(asset.id, 'loaded', this.load);
      this.progressbar.loaded += loaded;
    }
    if (totalSize) {
      this.progressbar.size += totalSize;
    }
    console.log(asset, loaded, totalSize);

    this.updateProgress();
  };

  updateAssetProgress = (asset, bitsLoaded) => {
    const id = this.getAssetId(asset);
    const badge = this.el.assets[id];
    if (badge) {
      this.el.assets[id].badge.innerHTML = '' + bitsLoaded;
    }
  };

  load = () => {
    for (const asset of this.assets) {
      getBlob(
        asset,
        this.updateAssetSize,
        //Success
        (asset, response) => {
          if (asset.group === this.TYPE_JS) this.loadJs(asset, response);
          if (asset.group === this.TYPE_MODULE) this.loadModule(asset, response);
        },
        //Error
        () => {},
      );
    }
  };

  loadJs = (asset, resolve) => {
    //console.log('js', asset, resolve);
  };

  loadModule = (asset, resolve) => {
    //console.log('module', asset, resolve);
  };

  loadError = (asset, message) => {
    //console.log('js', asset, message);
  };
}

function bootstrap() {
  const boot = new Bootloader(window.$bootloader);
  boot.init();
  boot.makeDisplay();
  boot.load();

  //Test
  boot.updateAssetProgress('monacoeditor', 123);
  boot.updateAssetProgress('opencvts', 1235);
}

window.addEventListener('load', bootstrap);
