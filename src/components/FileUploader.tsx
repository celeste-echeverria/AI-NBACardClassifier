"use client";

import React, { useState } from "react";
import styles from "../styles/FileUploader.module.css";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
        setError("Solo se permiten imágenes o archivos PDF.");
        return;
    }

    setFile(selected);
    setError(null);

    // Mostrar preview si es imagen
    if (selected.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selected);
    } else {
        setPreview(null);
    }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64 = await fileToBase64(file);

            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ file: base64, filename: file.name }),
            });

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError("Error al analizar el archivo");
        } finally {
            setLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

    return (
    <div className={styles.container}>
        <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className={styles.input}
        />

        {preview ? (
        <img src={preview} alt="Preview" className={styles.preview} />
        ) : (
        file && <p className={styles.fileName}>{file.name}</p>
        )}

        <button
        onClick={handleSubmit}
        className={styles.button}
        disabled={!file || loading}
        >
        {loading ? "Analizando..." : "Analizar tarjeta"}
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {result && (
        <pre className={styles.result}>
            {JSON.stringify(result, null, 2)}
        </pre>
        )}
    </div>
    );
}
