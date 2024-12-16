export function getFileUrl(fileName?: string, width: number = 300, height: number = 400) {
    if (!fileName) return `https://placewaifu.com/image/${width}/${height}`;
    return `/api/File/ViewFile/${fileName}`;
}
