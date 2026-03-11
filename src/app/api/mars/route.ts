import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { RoverPhoto } from "@/services/nasa-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rover = searchParams.get("rover") || "curiosity";
  const today = new Date().toISOString().split("T")[0];

  const docId = `${rover}_${today}`;
  const docRef = doc(db, "rover_cache", docId);

  try {
    // 1. TENTA BUSCAR NO FIRESTORE
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`🌟 Marte: Fotos do ${rover} vindas do Firestore`);
      return NextResponse.json(docSnap.data().photos);
    }

    // 2. BUSCA NA NASA
    console.log(`🛰️ Marte: Buscando ${rover} na NASA...`);
    const apiKey = process.env.NASA_API_KEY;
    let photos: RoverPhoto[] = [];

    // Tentativa 1: Fotos mais recentes
    try {
      const resLatest = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${apiKey}`,
        { next: { revalidate: 86400 } }
      );

      if (resLatest.ok) {
        const dataLatest = await resLatest.json();
        photos = dataLatest.latest_photos || [];
      }

      // Tentativa 2: Fallback caso o 'latest' esteja vazio ou dê erro
      if (photos.length === 0) {
        console.log(
          `⚠️ Sem fotos recentes para ${rover}. Buscando histórico (Sol 1000)...`
        );
        const resSol = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${apiKey}`
        );
        if (resSol.ok) {
          const dataSol = await resSol.json();
          photos = dataSol.photos || [];
        }
      }
    } catch (err) {
      console.error("Erro nos fetches da NASA:", err);
    }

    // 3. SALVA NO FIRESTORE SE ENCONTROU FOTOS
    if (photos.length > 0) {
      console.log(`💾 Salvando ${photos.length} fotos no Firestore...`);
      await setDoc(docRef, {
        photos: photos,
        createdAt: today,
        rover: rover,
      });
    }

    return NextResponse.json(photos);
  } catch (error) {
    console.error("Erro na Rota de Marte:", error);
    return NextResponse.json([]);
  }
}
