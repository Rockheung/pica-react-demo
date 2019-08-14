import React, { useRef, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import Pica from "pica";

const MAX_WIDTH = 400;
const MAX_HEIGHT = 1000;

const imgResize = (
  _imgSrc,
  targetWidth = MAX_WIDTH,
  targetHeight = MAX_HEIGHT,
  mode = "v" // or 'h'
) =>
  new Promise((resolve, reject) => {
    const pica = new Pica();
    const imgTag = new Image();

    imgTag.src = _imgSrc;
    imgTag.onload = () => {
      const _cvs = document.createElement("canvas");
      _cvs.width = targetWidth;
      _cvs.height = (targetWidth * imgTag.height) / imgTag.width;

      pica
        .resize(imgTag, _cvs)
        .then(_resizedCvs => pica.toBlob(_resizedCvs, "image/jpeg", 0.9))
        .then(resolve);
    };
  });

const loadImgUrl = imgFile =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = e => {
      resolve(e.target.result); // => Blob
    };
  });

function App() {
  const [imgFile, setImgFile] = useState(new Blob());
  const [imgSrc, setImgSrc] = useState("");
  const handleImgInput = e => setImgFile(e.target.files[0]);

  useEffect(() => {
    loadImgUrl(imgFile)
      .then(imgResize)
      .then(loadImgUrl) // Blob: Upload this if you want to
      .then(setImgSrc);
  }, [imgFile]);

  return (
    <div className="App">
      <input type={"file"} onChange={handleImgInput} />
      <br />
      <img src={imgSrc} />
    </div>
  );
}

export default App;
