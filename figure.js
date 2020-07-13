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
      return data.document.children[0].children.map((frame) => {
        return frame.id;
      });
    });
};

const loadImages = (ids) => {
  console.log(ids);
  return new Promise(function (resolve, reject) {
    resolve(ids);
  });
};

const addImagesToSite = (urls) => {
  const sectionTag = document.querySelector("section");
  sectionTag.innerHTML = "";

  urls.forEach((url) => {
    sectionTag.innerHTML =
      sectionTag.innerHTML +
      `
      <div>
        ${url}
      </div>
    `;
  });
};

loadFile(project)
  .then((ids) => loadImages(ids))
  .then((imageUrls) => addImagesToSite(imageUrls));
