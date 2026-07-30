/**
 * Renders the official Ymirr™ lockup (hexagon mark + wordmark, from the
 * supplied "logo ymirr.svg" master file) when the wordmark is wanted, or just
 * the icon-only mark (cropped from the same master, no redrawing) when space
 * is tight. Both are SVG so they stay crisp at any size and any accent color
 * background — no raster/placeholder logo remains in the project.
 */
export function Logo({ size = 40, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  if (withWordmark) {
    // The lockup's native aspect ratio is 103:32; scale height to `size` and
    // let width follow so proportions are never stretched or distorted.
    const height = size;
    const width = Math.round((103 / 32) * size);
    return (
      <img
        src="/brand/ymirr-logo-lockup.svg"
        alt="Ymirr™"
        width={width}
        height={height}
        className="logo logo--lockup"
        style={{ ['--logo-size' as string]: `${size}px` }}
      />
    );
  }

  return (
    <img
      src="/brand/ymirr-mark.svg"
      alt="Ymirr™"
      width={size}
      height={size}
      className="logo logo--mark"
      style={{ ['--logo-size' as string]: `${size}px` }}
    />
  );
}
