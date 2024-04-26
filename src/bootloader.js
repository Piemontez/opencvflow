const getBlob = (asset, progressCB, successCB, errorCB) => {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', asset.path, true);
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
        progressCB(asset, event.loaded, null);
      }
    },
    false,
  );
  xhr.addEventListener(
    'load',
    function (event) {
      var status = xhr.status;
      if (status === 200 || (status === 0 && xhr.response)) {
        progressCB(asset, asset.size, asset.size);
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
  assets = []; // [{id, group, assets, loaded, size}]
  el = {
    assetslist: null,
    progres: null,
    assets: {}, // { [id]: {li, badge} }
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
          loaded: 0,
          size: 0,
        })),
      )
      .flat();

    this.el.assetslist = document.getElementById(this.ASSETSLIST_TAGID);
    this.el.progres = document.getElementById(this.PROGRESSBAR_TAGID);
  };

  destroyRefs = () => {
    this.assets = [];
    this.el = {};
  };

  getAssetId = (path) => {
    return path
      .replace(/\..*/, '') // Remove extenção arquivo
      .replace(/[^\/]*\//g, '') // Remove pasta do arquivo
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
    badge.classList = 'badge badge-success';
    badge.innerHTML = '0';
    li.appendChild(badge);

    this.el.assetslist.appendChild(li);

    this.el.assets[asset.id] = { li, badge };
  };

  /**
   * Atualiza a barra de progresso do asset
   */
  updateAssetSize = (asset, loaded, size) => {
    //console.log(asset, loaded, size);
    if (loaded && size) {
      //asset.loaded = loaded;
      asset.size = size;
    } else {
      if (loaded) {
        asset.loaded += loaded;
      }
      if (size) {
        asset.size = size;
      }
    }
    const percentage = Math.round((asset.loaded / asset.size) * 1000) / 10;
    this.el.assets[asset.id].badge.innerHTML = percentage === Infinity ? '?' : percentage + '%';

    this.updateProgress();
  };

  /* Atualiza a barra de progresso total */
  updateProgress = () => {
    console.log(this.assets);
    const [loaded, size] = this.assets.reduce(
      (last, curr) => [
        // Soma os valores
        last[0] + curr.loaded || 0,
        last[1] + curr.size,
      ],
      // Valor iniciar
      [0, 0],
    );

    this.el.progres.setAttribute('value', loaded.toString());
    this.el.progres.setAttribute('max', size.toString());
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
