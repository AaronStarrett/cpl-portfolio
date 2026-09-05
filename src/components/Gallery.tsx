import { sitePath } from "../data/paths";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../data/schema";
export default function Gallery({
  images,
}: {
  images: Project["screenshots"];
}) {
  const [index, setIndex] = useState<number | null>(null),
    [zoom, setZoom] = useState(1),
    [natural, setNatural] = useState({ w: 1, h: 1 }),
    [space, setSpace] = useState({ w: 1000, h: 600 });
  const dialog = useRef<HTMLDialogElement>(null),
    stage = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; y: number; left: number; top: number } | null>(
      null,
    );
  useEffect(() => {
    if (index !== null) {
      setZoom(1);
      if (!dialog.current?.open) dialog.current?.showModal();
    } else dialog.current?.close();
  }, [index]);
  useEffect(() => {
    const element = stage.current;
    if (!element || index === null) return;
    const observer = new ResizeObserver(([entry]) =>
      setSpace({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [index]);
  const fit = Math.min(space.w / natural.w, space.h / natural.h);
  const size = { w: natural.w * fit * zoom, h: natural.h * fit * zoom };
  function change(delta: number) {
    setIndex((i) =>
      i === null ? null : (i + delta + images.length) % images.length,
    );
    setZoom(1);
  }
  function scale(next: number) {
    setZoom(Math.max(1, Math.min(6, next)));
  }
  return (
    <>
      <div className="evidence-grid">
        {images.map((s, i) => (
          <figure key={s.src}>
            <a
              href={sitePath(s.src)}
              onClick={(e) => {
                e.preventDefault();
                setIndex(i);
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={sitePath(s.src)} alt={s.alt} loading="lazy" />
              <span>Inspect workflow ↗</span>
            </a>
            <figcaption>
              {String(i + 1).padStart(2, "0")} / {s.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-labelledby="gallery-caption"
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "+" || e.key === "=") {
            scale(zoom + 0.5);
            e.preventDefault();
          }
          if (e.key === "-") {
            scale(zoom - 0.5);
            e.preventDefault();
          }
          if (e.key === "0") {
            setZoom(1);
            e.preventDefault();
          }
          if (zoom === 1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
            change(e.key === "ArrowRight" ? 1 : -1);
            e.preventDefault();
          }
        }}
      >
        <div className="gallery-toolbar">
          <strong>
            Workflow evidence{" "}
            <span>
              {index !== null ? `${index + 1} / ${images.length}` : ""}
            </span>
          </strong>
          <div>
            <button onClick={() => change(-1)} aria-label="Previous image">
              ←
            </button>
            <button onClick={() => change(1)} aria-label="Next image">
              →
            </button>
            <button
              onClick={() => scale(zoom - 0.5)}
              disabled={zoom === 1}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              onClick={() => scale(zoom + 0.5)}
              disabled={zoom === 6}
              aria-label="Zoom in"
            >
              +
            </button>
            <button onClick={() => setZoom(1)}>Fit</button>
            <button
              onClick={() => setIndex(null)}
              aria-label="Close image viewer"
            >
              ×
            </button>
          </div>
        </div>
        <div
          ref={stage}
          className="gallery-stage"
          tabIndex={0}
          role="region"
          aria-label="Zoomable image. Use plus and minus to zoom, drag or arrow keys to pan."
          style={{
            touchAction: zoom > 1 ? "none" : "auto",
            cursor: zoom > 1 ? "grab" : "default",
          }}
          onPointerDown={(e) => {
            if (zoom <= 1) return;
            drag.current = {
              x: e.clientX,
              y: e.clientY,
              left: e.currentTarget.scrollLeft,
              top: e.currentTarget.scrollTop,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            e.currentTarget.scrollLeft =
              drag.current.left - (e.clientX - drag.current.x);
            e.currentTarget.scrollTop =
              drag.current.top - (e.clientY - drag.current.y);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          {index !== null && (
            <div
              style={{
                width: Math.max(space.w, size.w),
                height: Math.max(space.h, size.h),
                display: "grid",
                placeItems: "center",
              }}
            >
              <img
                src={sitePath(images[index].src)}
                alt={images[index].alt}
                draggable={false}
                onLoad={(e) =>
                  setNatural({
                    w: e.currentTarget.naturalWidth,
                    h: e.currentTarget.naturalHeight,
                  })
                }
                style={{ width: size.w, height: size.h, maxWidth: "none" }}
              />
            </div>
          )}
        </div>
        {index !== null && (
          <div className="gallery-caption">
            <p id="gallery-caption">{images[index].caption}</p>
            <div>
              <span>
                {Math.round(zoom * 100)}% · + / − zoom · 0 fit · arrows browse
                or pan · Esc close
              </span>
              <a
                href={sitePath(images[index].src)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original image ↗
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
