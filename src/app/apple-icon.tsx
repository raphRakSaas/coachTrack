import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
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
          fontSize: 92,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          fontFamily: "sans-serif",
          borderRadius: "20%",
        }}
      >
        R
      </div>
    ),
    { ...size }
  )
}
