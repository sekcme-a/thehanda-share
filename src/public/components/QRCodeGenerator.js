import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

const QRCodeGenerator = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // QR 코드 생성
    QRCode.toCanvas(canvasRef.current, url, function (error) {
      if (error) console.error(error);
      console.log("QR code generated successfully!");
    });
  }, [url]);

  return (
    <canvas id="canvas" ref={canvasRef} />
  );
};

export default QRCodeGenerator;
