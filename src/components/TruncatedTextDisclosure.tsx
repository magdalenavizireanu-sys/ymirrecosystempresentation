import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Only one disclosure (tooltip, popover or mobile sheet) open at a time
 * across a whole grid of TruncatedTextDisclosure instances — opening one
 * closes any other. A hover-driven tooltip is naturally exclusive (a
 * pointer can only be over one thing), but tap-driven popovers/sheets stay
 * open independently of continued interaction, so they need this shared
 * coordinator to enforce the same rule.
 */
const DisclosureCoordinatorContext = createContext<{
  openId: string | null;
  setOpenId: (id: string | null) => void;
} | null>(null);

export function DisclosureCoordinatorProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);
  return (
    <DisclosureCoordinatorContext.Provider value={value}>
      {/* Radix's Tooltip.Root requires an ancestor Provider (it's what
          coordinates hover-delay timing across every tooltip beneath it) —
          one here covers every TruncatedTextDisclosure in the tree. */}
      <TooltipPrimitive.Provider delayDuration={200}>{children}</TooltipPrimitive.Provider>
    </DisclosureCoordinatorContext.Provider>
  );
}

function useDisclosureCoordinator(id: string) {
  const ctx = useContext(DisclosureCoordinatorContext);
  if (!ctx) throw new Error('TruncatedTextDisclosure must be used within a DisclosureCoordinatorProvider');
  const isOpen = ctx.openId === id;
  const setOpen = (next: boolean) => ctx.setOpenId(next ? id : null);
  return { isOpen, setOpen };
}

/** Same breakpoint this project already uses for its tablet/desktop split
 *  (see components.css's shared 768px/1024px bands) — reused here only to
 *  choose bottom-sheet vs. anchored-popover on non-hover devices, never to
 *  decide *whether* hover exists (that's the (hover:hover) query below). */
const MOBILE_QUERY = '(max-width: 47.9375rem)';
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';

/** Reserves extra room at the top of the viewport roughly matching the
 *  fixed navbar's height, so Radix's collision avoidance treats that band
 *  as occupied and flips the panel to the other side rather than opening
 *  underneath (and visually covering) the nav. */
const COLLISION_PADDING = { top: 76, bottom: 16, left: 16, right: 16 };

interface TruncatedTextDisclosureProps {
  /** Unique across the whole page — used both for the coordinator and for
   *  aria-describedby/aria-controls wiring. */
  id: string;
  /** The complete, original text — read straight from the same data object
   *  the visible clamped text came from, never rewritten. */
  fullText: string;
  /** Short label shown above the full text (e.g. the card's benefit
   *  title) and used as the mobile sheet's accessible dialog name. */
  contextLabel?: string;
  /** The already-clamped visible text/markup — rendered completely
   *  unchanged; this component only ever wraps it. */
  children: ReactNode;
  /** Class of the existing clamped element (e.g. "value-tile__problem") —
   *  preserved exactly so the visual result (size, clamp, colour) is
   *  identical whether or not this component ends up adding interactivity. */
  className: string;
}

/**
 * Wraps an existing line-clamped text block and, only when it's actually
 * overflowing, adds an accessible way to read the full text — a hover/focus
 * tooltip on devices with real hover, a tap-anchored popover on touch
 * tablets, and a bottom-sheet-style dialog on touch phones. When the text
 * isn't truncated, this renders exactly the plain element it always did —
 * no button, no aria wiring, no behaviour change at all.
 */
export function TruncatedTextDisclosure({
  id,
  fullText,
  contextLabel,
  children,
  className,
}: TruncatedTextDisclosureProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);
  const { isOpen, setOpen } = useDisclosureCoordinator(id);
  const canHover = useMediaQuery(HOVER_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // A 1px epsilon absorbs subpixel rounding between scrollHeight and
    // clientHeight that would otherwise register as "truncated" on text
    // that only just fits.
    const check = () => {
      setTruncated(el.scrollHeight - el.clientHeight > 1);
    };
    check();

    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(el);

    // Re-check once the real font has swapped in — before that, clamp
    // measurements are taken against the fallback font's metrics.
    document.fonts?.ready?.then(check).catch(() => {});

    return () => resizeObserver.disconnect();
    // `truncated` is a dependency (not just `fullText`): flipping it swaps
    // which element `textRef` points at (a bare <p> vs. the same <p> nested
    // inside a trigger <button>), so the effect must re-run to measure and
    // observe the *current* node — otherwise a later check here would read
    // a stale, detached reference to the pre-swap node (always 0×0) and
    // incorrectly flip `truncated` back off.
  }, [fullText, truncated]);

  const panelId = `${id}-panel`;

  if (!truncated) {
    return (
      <p ref={textRef} className={className}>
        {children}
      </p>
    );
  }

  const trigger = (
    <button type="button" className="disclosure-trigger" aria-describedby={panelId}>
      <p ref={textRef} className={className}>
        {children}
      </p>
    </button>
  );

  const panelBody = (
    <>
      {contextLabel && <p className="disclosure-panel__label">{contextLabel}</p>}
      <p className="disclosure-panel__text">{fullText}</p>
    </>
  );

  if (canHover) {
    return (
      <TooltipPrimitive.Root open={isOpen} onOpenChange={setOpen} delayDuration={200}>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            id={panelId}
            className="disclosure-panel disclosure-panel--tooltip"
            sideOffset={8}
            collisionPadding={COLLISION_PADDING}
            avoidCollisions
          >
            {panelBody}
            <TooltipPrimitive.Arrow className="disclosure-panel__arrow" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    );
  }

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className={`disclosure-overlay${reduced ? ' disclosure-overlay--reduced' : ''}`} />
          <DialogPrimitive.Content
            id={panelId}
            className={`disclosure-sheet${reduced ? ' disclosure-sheet--reduced' : ''}`}
            aria-describedby={`${panelId}-text`}
          >
            <div className="disclosure-sheet__handle" aria-hidden="true" />
            <DialogPrimitive.Title className="disclosure-sheet__title">
              {contextLabel ?? 'Full detail'}
            </DialogPrimitive.Title>
            <p id={`${panelId}-text`} className="disclosure-sheet__text">
              {fullText}
            </p>
            <DialogPrimitive.Close className="disclosure-sheet__close" aria-label="Close">
              ×
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          id={panelId}
          className="disclosure-panel disclosure-panel--popover"
          sideOffset={8}
          collisionPadding={COLLISION_PADDING}
          avoidCollisions
        >
          {panelBody}
          <PopoverPrimitive.Close className="disclosure-panel__close" aria-label="Close">
            ×
          </PopoverPrimitive.Close>
          <PopoverPrimitive.Arrow className="disclosure-panel__arrow" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
