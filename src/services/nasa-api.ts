interface APODData {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}
const API_KEY = process.env.NASA_API_KEY;
const API_BASE_URL = "https://api.nasa.gov/planetary/apod";

export async function getAPODData(): Promise<APODData | null> {
  if (!API_KEY) {
    console.error("NASA_API_KEY não definida no .env.local");
    return null;
  }
  const url = `${API_BASE_URL}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url, {});
    if (!response.ok) {
      console.error(`Erro ao buscar dados da APOD: ${response.statusText}`);
      return null;
    }
    const data: APODData = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na comunicação com a API da NASA:", error);
    return null;
  }
}
