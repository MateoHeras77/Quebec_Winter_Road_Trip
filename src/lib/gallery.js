import { carPhotos } from "../data/car.js";

export function initializeGallery() {
  const image = document.getElementById("carImage");
  const caption = document.getElementById("carCaption");
  const thumbnails = document.getElementById("carThumbnails");
  const dialog = document.getElementById("carLightbox");
  const largeImage = document.getElementById("lightboxImage");
  const zoom = document.getElementById("carZoom");

  function select(index) {
    const photo = carPhotos[index];
    image.src = photo.src;
    image.alt = photo.alt;
    caption.textContent = photo.caption;
    thumbnails.querySelectorAll("button").forEach((button, position) => {
      button.setAttribute("aria-pressed", String(position === index));
    });
  }

  carPhotos.forEach((photo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `Show ${photo.label.toLowerCase()} photo`,
    );
    button.setAttribute("aria-pressed", String(index === 0));
    const thumbnail = document.createElement("img");
    thumbnail.src = photo.src;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    const label = document.createElement("span");
    label.textContent = photo.label;
    button.append(thumbnail, label);
    button.addEventListener("click", () => select(index));
    thumbnails.append(button);
  });

  zoom.addEventListener("click", () => {
    largeImage.src = image.src;
    largeImage.alt = image.alt;
    dialog.showModal();
  });
  document
    .getElementById("closeCarLightbox")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    }
  });
}
