window.onload = () => {
  // DOMたち
  const input = document.querySelector('input');
  const preview = document.querySelector('.cocoa-resize-file-list');
  const previewCanvas = document.querySelector('.cocoa-resize-canvas');
  
  // インプットタグで指定したファイルたちを入れるオブジェクト
  let inputFiles = {};
  // 指定した画像ファイルのimageオブジェクトを入れる配列
  let imageFiles = [];

  // ファイル名とか、サムネイル画像表示を消す
  const initPreviewDisplay = () => {
    // previewエリアの初期化
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    // previewエリアの初期化
    while(previewCanvas.firstChild) {
      previewCanvas.removeChild(previewCanvas.firstChild);
    }
  };
  // 最初に消しておく
  initPreviewDisplay();


  function resizeImageDisplay() {
    // 表示を消しておく
    initPreviewDisplay();

    // インプットタグで指定したファイルたち
    inputFiles = input.files;

    // 指定された画像がある場合は、ファイル名と画像サイズを表示する
    if (inputFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'ファイルが選択されていません';
      preview.appendChild(para);
    } else {
      // ファイル名表示用のリスト
      const list = document.createElement('ol');
      preview.appendChild(list);
  
      // 指定されたファイル分だけ繰り返す
      for (let i = 0; i < inputFiles.length; i++ ) {
        const file = inputFiles[i];
        const listItem = document.createElement('li');
        const para = document.createElement('p');
        if (validFileType(file)) {
          // 表示するテキストを作る
          listItem.textContent = `ファイル名: ${file.name}, ファイルサイズ: ${returnFileSize(file.size)}.`;

          // Imageオブジェクトを作って配列に入れておく
          const image = new Image();
          image.src = URL.createObjectURL(file);
          imageFiles.push(image);
        } else {
          listItem.textContent = `ファイル名: ${file.name}: ファイル形式が有効ではありません。選択しなおしてください。`;
        }  
        list.appendChild(listItem);
      }
    }

    // サムネイル画像をキャンバスで表示
    if (imageFiles.length !== 0) {
      for (let i= 0; i < imageFiles.length; i++) {
        const imageItem = imageFiles[i];
        imageItem.onload = function() {

          const resize = getResize({
            height: imageItem.height, 
            width: imageItem.width
          });
          const canvas = document.createElement("canvas");
    
          canvas.id = "canvas" + i;
          canvas.width = resize.width ;
          canvas.height = resize.height;

          previewCanvas.appendChild(canvas);
          const context = canvas.getContext("2d");
          context.drawImage(imageItem, 0, 0, resize.width, resize.height);
        };
      }
    } 
    
  }
  


  const getResize = (orgSize) => {
    const ratio = orgSize.height / orgSize.width;
    let resizeHeight = 0;
    let resizeWidth = 0;

    if ( orgSize.width >= orgSize.height) {
      resizeWidth = 100;
      resizeHeight = resizeWidth * ratio;
    } else {
      resizeHeight = 100;
      resizeWidth = Math.ceil(resizeHeight / ratio);
    }

    return {
      width: resizeWidth,
      height: resizeHeight,
    };
  }
  function validFileType(file) {
    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileTypes = [
      "image/jpeg",
      "image/png",
    ];

    return fileTypes.includes(file.type);
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return `${number} バイト`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }

  input.addEventListener('change', resizeImageDisplay);

  document.getElementById("download-image").onclick = () => {
    for(let i=0; i < inputFiles.length; i++){
      const canvas = document.querySelector('#canvas' + i); 
      //アンカータグを作成
      var a = document.createElement("a");
      //canvasをJPEG変換し、そのBase64文字列をhrefへセット
      a.href = canvas.toDataURL();
      //ダウンロード時のファイル名を指定
      a.download = inputFiles[i].name.replace('.', '.tmb.');
      //クリックイベントを発生させる
      a.click();
    }

  };
}
 



