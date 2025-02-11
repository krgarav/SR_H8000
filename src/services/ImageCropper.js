async function cropImageToBase64(imgUrl, startX, startY, endX, endY) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Allow cross-origin images
        img.src = imgUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const width = endX - startX;
            const height = endY - startY;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, startX, startY, width, height, 0, 0, width, height);

            resolve(canvas.toDataURL("image/png")); // Convert to Base64
        };

        img.onerror = (err) => reject(err);
    });
}

export default cropImageToBase64;