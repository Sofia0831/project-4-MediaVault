import { useState } from "react";
import { normalizeBookCoverUrl } from "../utils/bookCovers";
import noCoverImage from "../assets/No_Cover.webp";
import "./BookCover.css";

const BookCover = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  fetchPriority = "auto",
}) => {
  const [failedUrl, setFailedUrl] = useState("");
  const [placeholderFailed, setPlaceholderFailed] = useState(false);
  const validUrl = normalizeBookCoverUrl(src);
  const showPlaceholder = !validUrl || failedUrl === validUrl;

  if (showPlaceholder) {
    if (!placeholderFailed) {
      return (
        <img
          src={noCoverImage}
          alt="No cover available"
          className={`${className} book-cover-fallback`}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          onError={() => setPlaceholderFailed(true)}
        />
      );
    }

    return (
      <div
        className={`${className} book-cover-placeholder`}
        role="img"
        aria-label="No cover available"
      >
        <span>No cover available</span>
      </div>
    );
  }

  return (
    <img
      src={validUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => setFailedUrl(validUrl)}
    />
  );
};

export default BookCover;
