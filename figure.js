// https://www.figma.com/developers
// https://api.figma.com/v1/files/PROJECTKEY
// https://api.figma.com/v1/images/PROJECTKEY

// When page loads we want to do some things
//  1. Get the file from figma
//  2. Organize the file by ids
//  3. With those [ids], generate some images from figma
//  4. Add them to the site

// loadFile().then((ids) => {
//   loadImages(ids).then(imageUrls => {
//     // In here add imageUrls to the site
//   })
// })

const loadingTag = document.querySelector("header p.loading");
const nextTag = document.querySelector("a.next");
const prevTag = document.querySelector("a.previous");
const stepsTag = document.querySelector("footer span");
const sliderTag = document.querySelector("div.slider");
const footerTag = document.querySelector("footer");

let currentSlide = 0;
let totalSlides = 0;

const project = "toW6EBiab28tMI5cTSF25S";

const apiKey = "53572-c57e45c3-6786-48f9-916c-d21cd60e4e82";
const apiHeaders = {
  headers: {
    "X-Figma-Token": apiKey,
  },
};

const loadFile = (key) => {
  return fetch("https://api.figma.com/v1/files/" + key, apiHeaders)
    .then((response) => response.json())
    .then((data) => {
      // We want to return a list of frame ids
      const ids = data.document.children[0].children.map((frame) => {
        return frame.id;
      });

      return {
        key: key,
        ids: ids,
        title: data.name,
      };
    });
};

const loadImages = (obj) => {
  const key = obj.key;
  const ids = obj.ids.join(",");

  return fetch(
    "https://api.figma.com/v1/images/" + key + "?ids=" + ids + "&scale=1",
    apiHeaders
  )
    .then((response) => response.json())
    .then((data) => {
      return obj.ids.map((id) => {
        return data.images[id];
      });
    });
};

const addImagesToSite = (urls) => {
  sliderTag.innerHTML = "";
  totalSlides = urls.length;

  footerTag.classList.add("show");

  urls.forEach((url) => {
    sliderTag.innerHTML =
      sliderTag.innerHTML +
      `
      <div>
        <img src="${url}" />
      </div>
    `;
  });
};

loadFile(project)
  .then((file) => {
    loadingTag.innerHTML = file.title;
    document.title = file.title + " - Figure";
    return file;
  })
  .then((file) => loadImages(file))
  .then((imageUrls) => addImagesToSite(imageUrls));

// Add in events for next and previous
const next = function () {
  currentSlide = currentSlide + 1;
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }
  moveSlider();
};

const previous = function () {
  currentSlide = currentSlide - 1;
  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  moveSlider();
};

const moveSlider = function () {
  sliderTag.style.transform = `translate(${currentSlide * -100}vw, 0)`;
  stepsTag.innerHTML = `${currentSlide + 1} / ${totalSlides}`;
};

nextTag.addEventListener("click", function () {
  next();
});

prevTag.addEventListener("click", function () {
  previous();
});
