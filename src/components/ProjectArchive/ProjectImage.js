import { useState } from 'react'

const ProjectImage = ({ name, imageUrl }) => {
  const [failedImageUrl, setFailedImageUrl] = useState(null)

  if (!imageUrl || failedImageUrl === imageUrl) {
    return null
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
