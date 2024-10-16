/**
 * @type {HTMLElement}
 */
const containerArt = document.querySelector(".container-art");
/**
 * @type {HTMLElement}
 */
const btnSubmit = document.querySelector(".btn");
/**
 * @type {HTMLInputElement}
 */
const input = document.querySelector(".value");

const fetchArtworks = () => {
  /**
   * @returns {Promise}
   */
  fetch(`https://api.artic.edu/api/v1/artworks/search?q=${input.value}`)
    /**
     * @param {Response}
     * @return {Promise}
     */
    .then((response) => response.json())
    /**
     * @param {Object}
     */
    .then((data) => {
      containerArt.innerHTML = ``;
      data.data.forEach((art) => {
        fetch(art.api_link)
          /**
           * @param {Response}
           * @return {Promise}
           */
          .then((response) => response.json())
          /**
           * @param {Object}
           */
          .then((data) => {
            /**
             * @type {HTMLElement}
             */
            const artContainer = document.createElement("div");
            artContainer.className =
              "flex flex-col w-[350px] h-[450px] justify-around items-center p-5 bg-neutral-100 rounded-md  ";

            const title = document.createElement("p");
            title.textContent = data.data.title;
            artContainer.appendChild(title);

            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = `https://www.artic.edu/iiif/2/${data.data.image_id}/full/150,/0/default.jpg`;
            figure.appendChild(img);
            artContainer.appendChild(figure);

            const button = document.createElement("button");
            button.textContent = "En savoir plus";
            button.className = " w-fit uppercase underline";
            button.setAttribute("data-dialogue", data.data.id);
            artContainer.appendChild(button);

            containerArt.appendChild(artContainer);

            const dialog = document.createElement("div");
            dialog.className = "dialog";
            dialog.setAttribute("id", `dialog-${data.data.id}`);

            const overlay = document.createElement("div");
            overlay.className =
              "overlay bg-white p-6 overflow-scroll w-1/2 gap-2";

            const closeButton = document.createElement("button");
            closeButton.textContent = "Fermer";
            closeButton.className = "close-dialog text-red-600 font-bold";
            overlay.appendChild(closeButton);

            const dialogTitle = document.createElement("p");
            dialogTitle.className = "text-xl";
            dialogTitle.textContent = data.data.title;
            overlay.appendChild(dialogTitle);

            const dialogImg = document.createElement("img");
            dialogImg.src = `https://www.artic.edu/iiif/2/${data.data.image_id}/full/150,/0/default.jpg`;
            overlay.appendChild(dialogImg);

            const dialogDescription = document.createElement("div");
            dialogDescription.innerHTML = data.data.description;
            overlay.appendChild(dialogDescription);

            const dialogNameArtist = document.createElement("p");
            dialogNameArtist.className = "underline";
            dialogNameArtist.textContent = data.data.artist_title;
            overlay.appendChild(dialogNameArtist);
            /**
             * @param {string}
             */
            data.data.term_titles.forEach((term) => {
              /**
               * @type {HTMLElement}
               */
              const containerTerm = document.createElement("ul");
              containerTerm.className = "bg-slate-200 p-4";
              const terms = document.createElement("li");
              terms.textContent = term;
              containerTerm.appendChild(terms);
              overlay.appendChild(containerTerm);
            });

            const dialogDate = document.createElement("p");
            dialogDate.textContent = data.data.date_start;
            dialogDate.className = "font-bold";
            overlay.appendChild(dialogDate);
            /**
             * @param {string}
             */
            data.data.material_titles.forEach((material) => {
              const containermaterial = document.createElement("ul");
              const materials = document.createElement("li");
              materials.textContent = material;
              containermaterial.appendChild(materials);
              overlay.appendChild(containermaterial);
            });

            dialog.appendChild(overlay);
            containerArt.appendChild(dialog);
          });
      });
      dialogEvent();
    });
};

const dialogEvent = () => {
  containerArt.addEventListener("click", (e) => {
    /**
     * @type {string}
     */
    const dialogId = e.target.getAttribute("data-dialogue");
    /**
     * @type {HTMLElement}
     */
    const dialog = document.querySelector(`#dialog-${dialogId}`);
    if (dialog) {
      dialog.setAttribute("open", "");
    }
    if (e.target.matches(".close-dialog")) {
      /**
       * @type {HTMLElement}
       */
      const dialog = e.target.closest(".dialog");
      dialog.removeAttribute("open");
    }
  });
};

btnSubmit.addEventListener("click", () => {
  fetchArtworks();
});

fetchArtworks();
