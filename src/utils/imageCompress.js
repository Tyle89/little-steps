/**
 * Redimensionne et compresse une image côté navigateur avant de la convertir
 * en base64. Nécessaire car Firestore limite chaque document à 1 Mo — une
 * photo brute de smartphone (souvent 2-8 Mo) ferait systématiquement
 * échouer l'écriture.
 *
 * @param {File} file - le fichier image sélectionné par l'utilisateur
 * @param {number} maxDimension - largeur/hauteur max en pixels (défaut 300)
 * @param {number} quality - qualité JPEG entre 0 et 1 (défaut 0.7)
 * @returns {Promise<string>} une data URL base64 compressée
 */
export function compressImage(file, maxDimension = 300, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

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