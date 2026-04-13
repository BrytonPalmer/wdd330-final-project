export function downloadImage(url, title) {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.jpg`;
    link.click();
}