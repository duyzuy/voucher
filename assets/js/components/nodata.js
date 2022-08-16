export const nodata = () => {
  const amyUrl = "images/booking/loadingicon/amy.png";

  const template = `<div class="vj__loading"><div class="vj__loading-container"><div class="vj__loading-image">
      <div class="vj__loading-amy"><img src="${amyUrl}" class="img-loading"></div>
      <div class="vj__loading-clouds">
        ${images}
      </div>
      </div>
      <div class="vj__loading-bottom">
      <span class="vj__loading-text">Enjoy Flying!</span>
      <span class="vj__loading-bar"><span class="vj__loading-bar-inner"></span></span></div></div></div>`;

  return template;
};
