import { useState } from 'react'

const ProjectImage = ({ name, imageUrl }) => {
  const [failedImageUrl, setFailedImageUrl] = useState(null)

  if (!imageUrl || failedImageUrl === imageUrl) {
    return (
      <div
        className="archive-placeholder"
        role="img"
        aria-label={`${name} preview unavailable`}
      >
        <span aria-hidden="true">Preview unavailable</span>
      </div>
    )
  }

  return (
    <img
      className="archive-image"
      src={imageUrl}
      alt={`Preview of ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailedImageUrl(imageUrl)}
    />
  )
}

export default ProjectImage
