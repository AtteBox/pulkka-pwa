/**
 * Function to download a file
 * 
 * copied from here: https://stackoverflow.com/a/30832210
 * with the following changes:
 * - removed ie support
 * - set display to none for the a element: https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server#comment111692380_33542499
 * 
 * @param {*} data data to download
 * @param {string} filename download filename
 * @param {string} type MIME Type 
 */
export function download(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a")
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}