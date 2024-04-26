const getBlob = (asset, progressCB, successCB, errorCB) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', asset.file, true);
  xhr.responseType = 'blob';

  xhr.onreadystatechange = function () {
    var clength = xhr.getResponseHeader('Content-Length');
    if (clength && !asset.size) {
      asset.size = clength;
      _this.totalSize += parseInt(asset.size);
    }
  };

  //set listeners
  xhr.addEventListener(
    'error',
    function (err) {
      return reject(err);
    },
    false,
  );
  xhr.addEventListener(
    'progress',
    function (event) {
      if (event.lengthComputable) {
        if (event.total && !asset.size) {
          asset.size = event.total;
          _this.totalSize += asset.size;
        }
        progressCB(asset.file, event.loaded);
      }
    },
    false,
  );
  xhr.addEventListener(
    'load',
    function (event) {
      var status = xhr.status;
      if (status === 200 || (status === 0 && xhr.response)) {
        progressCB(asset.file, asset.size);
        successCB(asset.file, xhr.response);
      } else {
        errorCB(asset.file, 'status: '.concat(xhr.status, ' - ').concat(xhr.statusText));
      }
    },
    false,
  );
  xhr.send();
};

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
        getBlob(
          assets,
          this.updateProgress,
          //Success
          (file, response) => {
            if (group === 'js') this.loadJs(file, response);
            if (group === 'module') this.loadModule(file, response);
          },
          //Error
          () => {},
        );
      }
    }
  };

  loadJs = (asset, resolve) => {
    console.log('js', asset, resolve);
  };

  loadModule = (asset, resolve) => {
    console.log('module', asset, resolve);
  };

  loadError = (asset, message) => {
    console.log('js', asset, message);
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
