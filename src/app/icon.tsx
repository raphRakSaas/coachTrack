import { ImageResponse } from "next/og"

export const size = { width: 192, height: 192 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
          color: "white",
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          fontFamily: "sans-serif",
        }}
      >
        R
      </div>
    ),
    { ...size }
  )
}
