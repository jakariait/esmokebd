export function setFaviconFromApi(imageName = "") {
  const API_URL = import.meta.env.VITE_API_URL || "";
  const baseUrl = API_URL.replace("/api", "");

  const faviconUrl = imageName
    ? `${baseUrl}/uploads/${imageName}?v=${Date.now()}`
    : ""; // No fallback if imageName is empty

  // Remove all existing icon links
  const existingIcons = document.querySelectorAll(
    "link[rel~='icon'], link[rel='apple-touch-icon']",
  );
  existingIcons.forEach((link) => link.parentNode.removeChild(link));

  // Only add a new icon if imageName is provided
  if (imageName) {
    const link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = faviconUrl;
    document.head.appendChild(link);
  }
}
