const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//creates a url for the js to interact with the live video

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err=> {
      console.error(`Oh NOO!`, err);
    })
};


function paintToCanvas() {
  const width= video.videoWidth;
  const height= video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {

  ctx.drawImage(video, 0, 0, width, height);
  //take out pixels into array
  let pixels = ctx.getImageData(0,0, width, height);
  // pixels = redEffect(pixels);
  // pixels = rgbSplit(pixels);
  pixels = greenScreen(pixels);
  ctx.globalAlpha = 0.8;
  ctx.putImageData(pixels, 0 ,0);
  }, 16)
};

function takePhoto() {
  //plays the sound
  snap.currentTime = 0;
  snap.play();

  //gets photo/localMediaStream
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  //shows image and you click to download
  link.innerHTML = `<img src='${data}' alt='Beautiful Selfie'/>`;
  strip.insertBefore(link, strip.firstChild);
};

function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i+0]= pixels.data[i+0] + 100; //r
    pixels.data[i+1]= pixels.data[i+1] - 50; //g
    pixels.data[i+2]= pixels.data[i+2] * 0.5; //b
  }
  return pixels;
};

function rgbSplit(pixels){
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150]= pixels.data[i+0]; //r
    pixels.data[i + 100]= pixels.data[i+1]; //g
    pixels.data[i - 550]= pixels.data[i+2]; //b
  }
  return pixels;
};

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });
  for (i = 0; i < pixels.data.length; i = i+4) {
    red = pixels.data[i+0];
    green = pixels.data[i+1];
    blue = pixels.data[i+2];
    alpha = pixels.data[i+3];

    if (red >=levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
        //takes out pixel
      pixels.data[i+3] = 0;
      }
  }
  return pixels;
}
//on page load

getVideo();

video.addEventListener('canplay', paintToCanvas);
