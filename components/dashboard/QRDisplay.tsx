"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";

interface QRDisplayProps {
  url: string;
  weddingTitle: string;
}

export default function QRDisplay({ url, weddingTitle }: QRDisplayProps) {
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  function downloadQR() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement("a");
      link.download = `qr-${weddingTitle.replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-display text-lg text-gray-900 mb-4">QR-код для гостей</h2>

      <div ref={svgRef} className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
          <QRCodeSVG
            value={url}
            size={220}
            bgColor="#ffffff"
            fgColor="#0D0A0B"
            level="M"
            imageSettings={{
              src: "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#D4875A"/><path d="M50 75 C30 55 25 40 35 30 C45 20 50 30 50 30 C50 30 55 20 65 30 C75 40 70 55 50 75Z" fill="white"/></svg>'),
              x: 90,
              y: 90,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-gray-400 font-sans mb-1">Ссылка для гостей</p>
        <p className="text-sm text-gray-700 font-sans break-all">{url}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-sans text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Скопировано!" : "Копировать ссылку"}
        </button>
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-400 hover:bg-gold-600 rounded-lg text-sm font-sans font-semibold text-dark-bg transition-colors"
        >
          <Download size={14} />
          Скачать QR
        </button>
      </div>
    </div>
  );
}
