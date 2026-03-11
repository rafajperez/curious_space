import React from "react";
import RoverPhotoGallery from "@/components/mars/RoverPhotoGallery";

export const metadata = {
  title: "Mars Rover Explorer | Nasa Explorer",
  description:
    "Veja fotos reais da superfície de Marte tiradas pelos Rovers da NASA.",
};

export default function MarsPage() {
  return (
    <div className="mars-page">
      <header className="mars-header">
        <h1>Exploração de Marte</h1>
        <p>Selecione um Rover e veja as capturas mais recentes!</p>
      </header>
      <RoverPhotoGallery />
    </div>
  );
}
