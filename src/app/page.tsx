import { getAPODData } from "@/services/nasa-api";
import Link from "next/link";

export default async function HomePage() {
  const apodData = await getAPODData();

  if (!apodData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>
          Serviço indisponível. <Link href="/mars">Ir para Marte</Link>
        </p>
      </div>
    );
  }

  const isImage = apodData.media_type === "image";

  // Imagem de fallback caso o APOD do dia seja um vídeo
  const fallbackImage =
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  const backgroundStyle = {
    backgroundColor: "#000",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${
      isImage ? apodData.hdurl || apodData.url : fallbackImage
    }')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Função simples para garantir que o link do vídeo seja um embed
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  return (
    <main style={backgroundStyle}>
      <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl max-w-2xl mx-4 border border-white/10 shadow-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {apodData.title}
        </h1>

        {/* Se for vídeo, mostra o player. Se for imagem, não precisa mostrar nada aqui pois já está no fundo */}
        {!isImage && (
          <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-inner">
            <iframe
              src={getEmbedUrl(apodData.url)}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 italic">
          {`"${apodData.explanation.substring(0, 250)}..."`}
        </p>

        <div className="flex flex-col gap-4 items-center">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            Crédito: {apodData.copyright || "NASA/APOD"}
          </span>

          <Link
            href="/mars"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Explorar o Mars Rover 🚀
          </Link>
        </div>
      </div>
    </main>
  );
}
