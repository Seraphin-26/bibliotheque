// components/books/book-cover.tsx
"use client";

export function BookCover({
  src,
  alt,
  width = 90,
  height = 130,
  style = {},
}: {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  if (!src) {
    return (
      <div style={{
        width, height,
        background: "#2a2540",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.min(width, height) * 0.4,
        flexShrink: 0,
        ...style,
      }}>
        📗
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: "cover", borderRadius: "8px", flexShrink: 0, ...style }}
      onError={e => {
        const el = e.currentTarget;
        el.style.display = "none";
        const placeholder = document.createElement("div");
        placeholder.textContent = "📗";
        placeholder.style.cssText = `width:${width}px;height:${height}px;background:#2a2540;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:${Math.min(width, height) * 0.4}px`;
        el.parentNode?.insertBefore(placeholder, el);
      }}
    />
  );
}
