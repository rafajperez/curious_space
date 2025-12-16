import { getAPODData } from "@/services/nasa-api";

export default async function HomePage() {
  const apodData = await getAPODData();

  if (!apodData || apodData.media_type !== "image") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-white p-6">
        <p className="text-xl">
          Erro ao carregar a Imagem do Dia. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  const backgroundStyle = {
    backgroundImage: `url('${apodData.hdurl || apodData.url}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  return (
    <main style={backgroundStyle} className="apod-page">
      <div className="apod-content-container">
        <h1 className="apod-title">{apodData.title}</h1>
        <p className="apod-explanation">
          {apodData.explanation.substring(0, 300)}...
        </p>
        <p className="apod-credit">
          Crédito: {apodData.copyright || "NASA/APOD"}
        </p>

        <a href="/mars" className="apod-action-button">
          🚀 Explorar o Mars Rover
        </a>
      </div>
    </main>
  );
}
