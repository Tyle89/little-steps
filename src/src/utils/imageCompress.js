/**
 * Resizes and compresses an image in the browser before converting it to
 * base64. Necessary because Firestore caps each document at 1 MiB - a raw
 * phone photo (often 2-8 MB) would reliably blow past that limit and make
 * the whole document write fail.
 *
 * @param {File} file - the image file picked by the user
 * @param {number} maxDimension - max width/height in pixels (default 300)
 * @param {number} quality - JPEG quality between 0 and 1 (default 0.7)
 * @returns {Promise<string>} a compressed base64 data URL
 */
export function compressImage(file, maxDimension = 300, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        // Scale down proportionally so the longer side never exceeds
        // maxDimension, preserving aspect ratio.
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

        // Drawing onto an off-screen canvas at the reduced size is what
        // actually performs the resize; toDataURL() then re-encodes it
        // as a (lossy) JPEG at the given quality, which is what keeps the
        // resulting base64 string small.
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }

      img.onerror = () => reject(new Error("Impossible de lire l'image."))
      img.src = event.target.result
    }

    reader.onerror = () => reject(new Error('Impossible de lire le fichier.'))
    reader.readAsDataURL(file)
  })
}
