import deepWebp from "../assets/deep.webp";
import deepDiveWebp from "../assets/deep-dive.webp";

/**
 * Deep-dive trigger: `deep.webp` + `deep-dive.webp` as one horizontal strip (tops/heights aligned).
 */
export default function DeepDiveImageButton({ onClick, title, tourAnchor, ...rest }) {
  const label = title || "Open concept guide";
  return (
    <button
      type="button"
      className="inpact-deep-dive-img-btn"
      onClick={onClick}
      title={label}
      aria-label={label}
      {...(tourAnchor ? { "data-tour-id": "deep-dive-button" } : {})}
      {...rest}
    >
      <span className="inpact-deep-dive-img-pair">
        <img className="inpact-deep-dive-img-left" src={deepWebp} alt="" decoding="async" />
        <img className="inpact-deep-dive-img-right" src={deepDiveWebp} alt="" width={75} decoding="async" />
      </span>
    </button>
  );
}
