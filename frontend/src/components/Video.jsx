import React, { useEffect, useRef } from "react";


function Video() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // Assign the stream to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
        });
    }
  }, []);

  return (
    <div className="video-div">
      <video className="video" ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default Video;
