"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Importamos o componente de imagem otimizado
import { RoverPhoto } from "@/services/nasa-api";

export default function RoverPhotoGallery() {
  const [photos, setPhotos] = useState<RoverPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [rover, setRover] = useState("curiosity");

  useEffect(() => {
    async function loadPhotos() {
      setLoading(true);
      try {
        const response = await fetch(`/api/mars?rover=${rover}`);

        if (!response.ok) {
          console.error("Erro na resposta da API");
          setPhotos([]);
          return;
        }

        const data = await response.json();
        const photosArray = Array.isArray(data) ? data : data.photos || [];

        setPhotos(photosArray);
      } catch (error) {
        console.error("Falha ao carregar fotos:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, [rover]);

  return (
    <section className="gallery-container">
      <div className="rover-selector">
        {["curiosity", "opportunity", "spirit"].map((r) => (
          <button
            key={r}
            onClick={() => setRover(r)}
            className={rover === r ? "active" : ""}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader">Carregando fotos de Marte...</div>
      ) : (
        <div className="photo-grid">
          {photos?.map((photo) => (
            <div key={photo.id} className="photo-card">
              <div
                className="image-wrapper"
                style={{ position: "relative", height: "200px" }}
              >
                <Image
                  src={photo.img_src}
                  alt={`Foto de Marte tirada por ${photo.rover.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div className="photo-info">
                <span>{photo.camera.full_name}</span>
                <small>{photo.earth_date}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
