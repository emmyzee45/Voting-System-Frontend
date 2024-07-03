import Webcam from "react-webcam";
import React, { useCallback, useRef } from "react";

type setIMageProps = {
  imgSrc: string,
  setImgSrc: React.Dispatch<React.SetStateAction<string>>
}

const CustomWebcam = ({imgSrc, setImgSrc}: setIMageProps) => {
    const webcamRef = useRef<Webcam>(null);

    const retake = () => {
      setImgSrc("");
    };
    // create a capture function
    const capture = useCallback(() => {
      if(webcamRef.current) {
        const imageSrc = (webcamRef.current as any).getScreenshot();
        setImgSrc(imageSrc);
      }
    }, [webcamRef]);
  
    return (
      <div className="container">
        {imgSrc ? (
          <img src={imgSrc} alt="webcam" />
        ) : (
          <Webcam 
            height={600} 
            width={600} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg"
            screenshotQuality={0.8}
          />
        )}
        <div className="btn-container">
          {imgSrc ? (
            <button onClick={retake}>Retake photo</button>
          ) : (
            <button onClick={capture}>Capture photo</button>
          )}
        </div>
      </div>
    );
  };

  export default CustomWebcam;