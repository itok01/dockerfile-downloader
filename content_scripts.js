const downloadIconURL = chrome.extension.getURL('cloud_download-24px.svg')

window.addEventListener('load', main, false);

function main(e) {
  let jsInitChecktimer = setInterval(jsLoaded, 1000);

  function jsLoaded() {
    if (document.getElementsByClassName('styles__detail___39I8C')[0] !=
        undefined) {
      clearInterval(jsInitChecktimer);

      let detail = document.getElementsByClassName('styles__detail___39I8C')[0];

      let downloadButton = document.createElement('img');
      downloadButton.src = downloadIconURL;
      downloadButton.onclick = function() {
        path = window.location.pathname.split('/');
        let imagesUrl = '';
        if (path[6] == 'images') {
          imagesUrl = 'https://hub.docker.com/v2/repositories/library/' +
              path[4] + '/tags/' + path[5] + '/images';
        } else {
          imagesUrl = 'https://hub.docker.com/v2/repositories/' + path[2] +
              '/' + path[3] + '/tags/' + path[4] + '/images';
        }
        fetch(imagesUrl).then(r => r.text()).then(result => {
          images = JSON.parse(result);

          let dockerfileString = '';
          for (let i = 0; i < images[0].layers.length; i++) {
            dockerfileString += images[0].layers[i].instruction + '\n';
          }

          console.log(dockerfileString);
          let dockerfileBlob = new Blob([dockerfileString]);
          let dockerfileBlobURL = URL.createObjectURL(dockerfileBlob);
          console.log(dockerfileBlobURL);

          console.log(chrome);
          chrome.runtime.sendMessage({URL: dockerfileBlobURL});
        });
      };
      detail.appendChild(downloadButton);
    }
  }
}

// https://hub.docker.com/layers/hello-world/library/hello-world/latest/images/sha256-85dc5fbe16214366748ebe9d7cc73bc42d61d19d61fe05f01e317d278c2287ed
// (8) ["", "layers", "hello-world", "library", "hello-world", "latest",
// "images",
// "sha256-85dc5fbe16214366748ebe9d7cc73bc42d61d19d61fe05f01e317d278c2287ed"]
// https://hub.docker.com/v2/repositories/library/hello-world/tags/latest/images

// https://hub.docker.com/layers/itok01/cheers2019/latest/images/sha256-90673527322dc2a057e72845b9651a11615c305e4165ab3741f974efb026e177
// (7) ["", "layers", "itok01", "cheers2019", "latest", "images",
// "sha256-90673527322dc2a057e72845b9651a11615c305e4165ab3741f974efb026e177"]
// https://hub.docker.com/v2/repositories/itok01/cheers2019/tags/latest/images
