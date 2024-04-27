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
    function () {
      var status = xhr.status;
      if (status === 200 || (status === 0 && xhr.response)) {
        progressCB(asset, asset.size, asset.size);
        successCB(asset, xhr);
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
  tags = [];
  el = {
    assetslist: null,
    progres: null,
    assets: {}, // { [id]: {li, badge} }
  };

  constructor(assetsGroups) {
    if (this.assetsGroups) {
      this.assetsGroups = assetsGroups;
    }
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
    this.assetsGroups = [];
    this.assets = [];
    this.tag = [];
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
    if (loaded && size) {
      asset.loaded = loaded;
      asset.size = size;
    } else {
      if (loaded) {
        asset.loaded = loaded;
      }
      if (size) {
        asset.size = size;
      }
    }
    const percentage = Math.round((asset.loaded / asset.size) * 1000) / 10;
    this.el.assets[asset.id].badge.innerHTML = percentage + '%';

    this.updateProgress();
  };

  /* Atualiza a barra de progresso total */
  updateProgress = () => {
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

  load = () => {
    for (const asset of this.assets) {
      getBlob(asset, this.updateAssetSize, this.onLoaded, this.onLoadedError);
    }
  };

  onLoaded = (asset, xhr) => {
    var tag =
      asset.group === this.TYPE_JS //
        ? this.createScriptModuleTag(xhr.response, asset.id)
        : asset.group === this.TYPE_MODULE
        ? this.createLinkModuleTag(xhr.response, asset.id)
        : null;

    this.tags.push(tag);
    if (this.tags.length === this.assets.length) {
      document.getElementById('root').innerHTML = '';
      //Adiciona as tags com o conteudo carregado
      for (const tag of this.tags) {
        document.body.append(tag);
      }
      this.destroyRefs();
    }
  };

  onLoadedError = (_, message) => {
    console.log(message);
  };

  createScriptModuleTag = function (blob, id) {
    var objectURL = URL.createObjectURL(blob);

    var tag = document.createElement('script');
    tag.id = id;
    tag.type = 'module';
    tag.src = objectURL;
    return tag;
  };

  createLinkModuleTag = function (blob, id) {
    var objectURL = URL.createObjectURL(blob);

    var tag = document.createElement('link');
    tag.id = id;
    tag.rel = 'modulepreload';
    tag.href = objectURL;
    return tag;
  };
}
/*
<script type="module" crossorigin src="/index_CvmYgTZk.js"></script>
<link rel="modulepreload" crossorigin href="/deps/monacoeditor.js">
<link rel="modulepreload" crossorigin href="/deps/opencvts.js">
*/

function bootstrap() {
  const loaderCardTag = document.getElementById('loadercard');
  loaderCardTag.classList = [...loaderCardTag.classList].filter((c) => c !== 'hidden');

  const boot = new Bootloader(window.$bootloader);
  boot.init();
  boot.makeDisplay();
  boot.load();

  //Test
}

window.addEventListener('load', bootstrap);
