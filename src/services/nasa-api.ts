import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

// Centralizando as configurações no topo
const API_KEY = process.env.NASA_API_KEY;
const APOD_URL = "https://api.nasa.gov/planetary/apod";
const MARS_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers";

export async function getAPODData(): Promise<APODData | null> {
  const today = new Date().toISOString().split("T")[0];
  const docRef = doc(db, "nasa_cache", `apod_${today}`);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("🌟 APOD: Recuperada do Firestore");
      return docSnap.data() as APODData;
    }

    if (!API_KEY) {
      console.error("ERRO: NASA_API_KEY não configurada.");
      return null;
    }

    console.log("🛰️ Buscando APOD na NASA...");
    // Usando as constantes globais aqui
    const response = await fetch(`${APOD_URL}?api_key=${API_KEY}`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) return null;

    const data: APODData = await response.json();
    await setDoc(docRef, data);

    return data;
  } catch (error) {
    console.error("Erro no cache da APOD:", error);
    return null;
  }
}

export interface RoverPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: { full_name: string };
  rover: { name: string; status: string };
}

export async function getRoverPhotos(
  rover: string = "curiosity",
): Promise<RoverPhoto[]> {
  const today = new Date().toISOString().split("T")[0];
  const docId = `${rover}_${today}`;
  const docRef = doc(db, "rover_cache", docId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`🚀 Fotos do ${rover} recuperadas do Firestore`);
      return docSnap.data().photos as RoverPhoto[];
    }

    if (!API_KEY) {
      console.error("ERRO: NASA_API_KEY não encontrada.");
      return [];
    }

    console.log(`🛰️ Buscando fotos do ${rover} na NASA...`);
    // Usando as constantes globais aqui também
    const url = `${MARS_URL}/${rover}/latest_photos?api_key=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 86400 } });

    if (!response.ok) {
      console.error(`Erro Nasa (${response.status})`);
      return [];
    }

    const data = await response.json();
    const photos = data.latest_photos || [];

    if (photos.length > 0) {
      await setDoc(docRef, {
        photos: photos,
        createdAt: today,
      });
    }

    return photos;
  } catch (error) {
    console.error("Erro ao buscar fotos de Marte:", error);
    return [];
  }
}
