import frameImage from '@/assets/frame.png';

// Frame dimensions - the black box position within the frame
// These are approximate percentages based on analyzing the frame image
// The box is on the left side of the frame, roughly positioned at:
// x: ~5.5%, y: ~38%, width: ~28%, height: ~32%
export const FRAME_CONFIG = {
  // Photo placement area (the rectangular box in the frame) as percentages
photoBox: {
  x: 0.47,     // Left positio
  y: 0.34,      // Top position
  width: 0.34, // Photo width
  height: 0.32 // Photo height
},

// Name placement (centered below photo)
namePosition: {
  x: 0.5,   // relative horizontal center inside photo box (will be applied to box)
  yOffset: 0.04    // vertical offset (relative to canvas height) below the photo box
},

// Frame size
outputWidth: 1080,
outputHeight: 1296

};

export async function generateFramedImage(
  croppedPhoto: string,
  participantName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = FRAME_CONFIG.outputWidth;
    canvas.height = FRAME_CONFIG.outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('No canvas context');

    const frame = new Image();
    frame.crossOrigin = 'anonymous';
    frame.onload = () => {
      // Draw frame first
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

      // Load and draw the user's photo
      const photo = new Image();
      photo.crossOrigin = 'anonymous';
      photo.onload = () => {
        const box = FRAME_CONFIG.photoBox;
        const px = box.x * canvas.width;
        const py = box.y * canvas.height;
        const pw = box.width * canvas.width;
        const ph = box.height * canvas.height;

        // Draw the photo so it "covers" the photo box (center-crop to fill)
        const photoAspect = photo.width / photo.height;
        const boxAspect = pw / ph;
        let drawWidth: number;
        let drawHeight: number;
        let offsetX = 0;
        let offsetY = 0;

        if (photoAspect > boxAspect) {
          // source is wider — scale by height so it fills vertically, crop horizontally
          drawHeight = ph;
          drawWidth = ph * photoAspect;
          offsetX = (pw - drawWidth) / 2;
        } else {
          // source is taller — scale by width so it fills horizontally, crop vertically
          drawWidth = pw;
          drawHeight = pw / photoAspect;
          offsetY = (ph - drawHeight) / 2;
        }

        // Clip to the photo box so image stays inside the framed area
        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, pw, ph);
        ctx.clip();

        ctx.drawImage(
          photo,
          0,
          0,
          photo.width,
          photo.height,
          px + offsetX,
          py + offsetY,
          drawWidth,
          drawHeight
        );

        ctx.restore();

        // Re-draw the frame on top so photo appears behind frame edges
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // Draw participant name centered below the photo box
        const nameX = px + pw * FRAME_CONFIG.namePosition.x; // center of photo box
        const nameY = py + ph + (FRAME_CONFIG.namePosition.yOffset * canvas.height);

        // Responsive font sizing based on canvas width
        const fontSize = Math.round(canvas.width * 0.035);
        ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
        ctx.fillStyle = '#7B1F3A'; // maroon color matching the frame
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // constrain text to the width of the photo box
        ctx.fillText(participantName, nameX, nameY, pw);

        resolve(canvas.toDataURL('image/png', 1.0));
      };
      photo.onerror = reject;
      photo.src = croppedPhoto;
    };
    frame.onerror = reject;
    frame.src = frameImage;
  });
}
