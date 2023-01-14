const sourceFolder = "./src";
const buildFolder = "./dist";

export const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/images/`,
    svg: `${buildFolder}/icons/`,
    js: `${buildFolder}/js/`,
  },
  src: {
    html: `${sourceFolder}/*.html`,
    scss: `${sourceFolder}/scss/main.scss`,
    images: `${sourceFolder}/images/**/*.{jpg,jpeg,png,gif,webp}`,
    svgImages: `${sourceFolder}/images/**/*.svg`,
    svg: `${sourceFolder}/icons/svg/*.svg`,
    js: `${sourceFolder}/js/script.js`,
  },
  watch: {
    html: `${sourceFolder}/**/*.html`,
    scss: `${sourceFolder}/scss/**/*.scss`,
    images: `${sourceFolder}/images/**/*.{jpg,jpeg,png,gif,webp,svg}`,
    svg: `${sourceFolder}/icons/svg/*.svg`,
    js: `${sourceFolder}/js/**/*.js`,
  },
  clear: buildFolder,
  buildFolder,
  sourceFolder,
};
