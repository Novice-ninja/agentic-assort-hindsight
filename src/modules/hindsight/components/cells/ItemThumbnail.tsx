import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FLOORING_NEUTRAL_SWATCH, getFlooringSwatchForItem } from '@mocks/flooringDemo';
import { Modal } from '@shared/components/primitives';
import { getPlaceholderImageForItem } from '../../services/placeholderItemImages';
import styles from './ItemThumbnail.module.css';

const standInImage=FLOORING_NEUTRAL_SWATCH;

export interface ItemThumbnailProps {
  /** Absent, `null`, or blank all read as "this item has no image". */
  imageUrl?: string | null;
  /** Alt text for the image. Also describes the item to assistive technology.  */
  description: string;
  /**
   * Identifies the item, ideally its style id. Only used to pick its illustrative swatch, and only
   * while the catalogue serves no imagery of its own — see `placeholderItemImages`.
   */
  itemId?: string;
  size?: 'sm' | 'square' | 'lg';
  /**
   * Opens an enlarged preview on click (closes on backdrop / Escape). Defaults on for the
   * compact sizes used in tables and cards; off for `lg`, which is already large.
   */
  enlargeable?: boolean;
}

/**
 * An item's image, or a bundled stand-in of identical dimensions when there is none.
 *
 * The fixed frame is the point: a missing image must not change the row height or the card
 * footprint, or a grid of items jumps around as images resolve. So every outcome — still loading,
 * never had a source, failed to load — occupies exactly the same box, and a failure shows a
 * photograph rather than a broken-image glyph.
 *
 * Sources are tried in order: the catalogue's own image, then the temporary illustrative swatchgraphy,
 * then the neutral placeholder. The catalogue always wins where it has something usable, so this
 * reads the same way once real imagery lands. A URL that will not load counts as nothing, which
 * is why failures are remembered per source — falling back to a source that already failed would
 * put the two candidates in a loop, each error handing over to the other.
 *
 * Load state is tracked against the URL that produced it, so a new `imageUrl` returns to the
 * skeleton on its own instead of briefly showing the previous item's outcome.
 *
 * Compact thumbnails (`sm` / `square`) open a portaled enlarge dialog so planners can inspect
 * product photography without leaving the table or card strip.
 */
export function ItemThumbnail({
  imageUrl,
  description,
  itemId,
  size = 'sm',
  enlargeable = size !== 'lg',
}: ItemThumbnailProps) {
  const { t } = useTranslation('hindsight');
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const usable = (candidate: string | null): candidate is string =>
    candidate !== null && candidate.length > 0 && !failedSources.has(candidate);

  // Canonical priority IDs supersede any stale cached apparel thumbnail URL.
  const canonicalSwatch=getFlooringSwatchForItem(itemId ?? '');
  const fromApi = canonicalSwatch ?? imageUrl?.trim() ?? '';
  const imageDescription=canonicalSwatch ? `${description} · illustrative flooring swatch` : description;
  const standIn = getPlaceholderImageForItem(itemId ?? description);
  const src = usable(fromApi) ? fromApi : usable(standIn) ? standIn : '';

  const loading = src.length > 0 && loadedSrc !== src;
  const frame = [styles.frame, styles[size]].join(' ');
  const canEnlarge = enlargeable && src.length > 0;
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  const preview =
    canEnlarge && previewOpen
      ? createPortal(
          <Modal
            open
            onClose={closePreview}
            title={description.trim() || t('items.imagePreview', 'Product image')}
            dialogClassName={styles.previewDialog}
            data-testid="hindsight-item-image-preview"
          >
            <img className={styles.previewImage} src={src} alt={imageDescription} />
          </Modal>,
          document.body,
        )
      : null;

  if (src.length === 0) {
    return (
      <img
        className={[frame, styles.standIn].join(' ')}
        // Neutral material illustration; no apparel or authentic-photo fallback.
        src={standInImage}
        alt={t('topPerformers.noImage')}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const image = (
    <>
      <img
        // A cached image can complete before React attaches onLoad, which would strand the
        // skeleton over an image that is already there.
        ref={(node) => {
          if (node !== null && node.complete && node.naturalWidth > 0) setLoadedSrc(src);
        }}
        className={styles.image}
        data-loading={loading ? 'true' : undefined}
        src={src}
        alt={imageDescription}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSources((current) => new Set(current).add(src))}
      />
      {loading && <span className={styles.skeleton} aria-hidden="true" />}
    </>
  );

  if (!canEnlarge) {
    return (
      <span className={[frame, styles.wrap].join(' ')}>
        {image}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        className={[frame, styles.wrap, styles.enlargeable].join(' ')}
        aria-label={t('items.enlargeImage', {
          defaultValue: 'Enlarge image: {{description}}',
          description: description.trim() || t('items.imagePreview', 'Product image'),
        })}
        data-testid="hindsight-item-thumbnail-enlarge"
        onClick={(event) => {
          // Keep the enlarge action off row / card click handlers.
          event.stopPropagation();
          setPreviewOpen(true);
        }}
      >
        {image}
      </button>
      {preview}
    </>
  );
}
