import React from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>NBA PSA Card Classifier</h1>
      <p>Subí una imagen o un PDF con la tarjeta PSA para analizarla.</p>
      <FileUploader />
    </main>
  );
}
