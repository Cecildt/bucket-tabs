import imagemagick from 'imagemagick';

const root = `../public/assets/images/`;
const filename = 'bucket.png';

/**
 * Creates icons from an image for the manifest.
 * Sizes: 16, 32, 48, 128
 */
function createIcons() {
  for (let size of [16, 32, 48, 128]) {
    imagemagick.resize(
      {
        srcPath: `${root}${filename}`,
        dstPath: `${root}icon${size}.png`,
        width: size,
        height: size,
      },
      (err, _) => {
        if (err) {
          console.error(err.message);
          throw err;
        }
      }
    );
    console.log(`resized ${filename} to ${size}x${size}`);
  }
}

createIcons();
