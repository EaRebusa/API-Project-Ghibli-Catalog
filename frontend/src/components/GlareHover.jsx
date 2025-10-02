import './GlareHover.css';

export default function GlareHover({
  children,
  glareColor = '#ffffffff',
  glareOpacity = 0.05,      // softer glare
  glareAngle = -25,         // gentle angle
  glareSize = 400,           // bigger gradient to cover full card
  transitionDuration = 2000,  // slower, cinematic effect
  playOnce = false,
}) {

  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r},${g},${b},${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r},${g},${b},${glareOpacity})`;
  }

  const style = {
    '--gh-angle': `${glareAngle}deg`,
    '--gh-size': `${glareSize}%`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-rgba': rgba,
  };

  return (
    <div className="glare-hover-wrapper" style={style}>
      {children}
      <div className={`glare-overlay ${playOnce ? 'play-once' : ''}`}></div>
    </div>
  );
}
