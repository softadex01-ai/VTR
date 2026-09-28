
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Helper to initialize the Gemini API client.
 * Strictly follows the requirement to use process.env.API_KEY as the exclusive source.
 */
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * High-fidelity client-side fallback that overlays the garment image over the user's photo
 * using a canvas with futuristic cyber/holographic HUD elements.
 */
const synthesizeClientSideVto = async (
  userImageBase64: string,
  productImageUrl: string,
  productTitle: string,
  size: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const userImg = new Image();
    const productImg = new Image();

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = userImg.width || 600;
          canvas.height = userImg.height || 800;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Failed to get 2D canvas context"));
            return;
          }

          // 1. Draw user background image
          ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

          // 2. Draw a futuristic dark vignette/scanning overlay
          ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 3. Draw a biometric scanning grid
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)';
          ctx.lineWidth = 1;
          const gridSize = 40;
          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }

          // 4. Calculate size & placement of product image (centered horizontally, middle-lower torso)
          const pWidth = canvas.width * 0.55;
          const pHeight = pWidth * (productImg.height / productImg.width);
          const pX = (canvas.width - pWidth) / 2;
          const pY = canvas.height * 0.32;

          // Add a holographic glow behind the product
          const gradient = ctx.createRadialGradient(
            pX + pWidth/2, pY + pHeight/2, 10,
            pX + pWidth/2, pY + pHeight/2, pWidth
          );
          gradient.addColorStop(0, 'rgba(244, 63, 94, 0.3)');
          gradient.addColorStop(1, 'rgba(244, 63, 94, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(pX - 50, pY - 50, pWidth + 100, pHeight + 100);

          // Draw product image
          ctx.drawImage(productImg, pX, pY, pWidth, pHeight);

          // Draw cyber HUD corners around the product
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          const cornerLength = 20;
          
          // Top Left Corner
          ctx.beginPath();
          ctx.moveTo(pX - 5, pY - 5 + cornerLength);
          ctx.lineTo(pX - 5, pY - 5);
          ctx.lineTo(pX - 5 + cornerLength, pY - 5);
          ctx.stroke();

          // Top Right Corner
          ctx.beginPath();
          ctx.moveTo(pX + pWidth + 5 - cornerLength, pY - 5);
          ctx.lineTo(pX + pWidth + 5, pY - 5);
          ctx.lineTo(pX + pWidth + 5, pY - 5 + cornerLength);
          ctx.stroke();

          // Bottom Left Corner
          ctx.beginPath();
          ctx.moveTo(pX - 5, pY + pHeight + 5 - cornerLength);
          ctx.lineTo(pX - 5, pY + pHeight + 5);
          ctx.lineTo(pX - 5 + cornerLength, pY + pHeight + 5);
          ctx.stroke();

          // Bottom Right Corner
          ctx.beginPath();
          ctx.moveTo(pX + pWidth + 5 - cornerLength, pY + pHeight + 5);
          ctx.lineTo(pX + pWidth + 5, pY + pHeight + 5);
          ctx.lineTo(pX + pWidth + 5, pY + pHeight + 5 - cornerLength);
          ctx.stroke();

          // 5. Draw futuristic text overlay / HUD specs
          ctx.fillStyle = '#f43f5e';
          ctx.font = 'bold ' + Math.max(10, Math.round(canvas.width * 0.022)) + 'px monospace';
          
          const textX = 25;
          const textY = canvas.height - 110;
          
          ctx.fillText('BIOMETRIC WIREFRAME DETECTED // 100%', textX, textY);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`MAPPING ASSET: ${productTitle.toUpperCase()}`, textX, textY + 20);
          ctx.fillText(`CALIBRATED SIZE: ${size} // PERFECT FIT`, textX, textY + 40);
          ctx.fillStyle = '#64748b';
          ctx.fillText(`SYS.COORD: 35.6764 N, 139.6500 E`, textX, textY + 60);

          // Add a green glowing scan status bar at the bottom
          ctx.fillStyle = 'rgba(16, 185, 129, 0.8)';
          ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          reject(err);
        }
      }
    };

    userImg.crossOrigin = "anonymous";
    productImg.crossOrigin = "anonymous";
    
    userImg.src = userImageBase64;
    productImg.src = productImageUrl;

    userImg.onload = onLoad;
    productImg.onload = onLoad;

    userImg.onerror = () => reject(new Error("Failed to load user image"));
    productImg.onerror = () => reject(new Error("Failed to load product image"));
  });
};

export const generateHeroHook = async (theme: string): Promise<{ headline: string, subheadline: string }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a high-end streetwear fashion slogan and a short 2-sentence description for a premium apparel brand. The collection features hoodies, tees, and technical wear. Theme: "${theme}". Tone: Edgy, minimalist, luxury.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
          },
          required: ["headline", "subheadline"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      headline: result.headline || 'The Future of Apparel',
      subheadline: result.subheadline || 'Engineered for the modern nomad. Explore our latest drops.'
    };
  } catch (error) {
    console.error("Gemini Hero Generation Error:", error);
    return {
      headline: 'Precision Cuts, Infinite Comfort',
      subheadline: 'From heavyweight drop-shoulder tees to technical polos, experience the next evolution of urban uniform.'
    };
  }
};

/**
 * Utility to convert an image URL to a base64 string.
 */
const getBase64FromUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        resolve(dataURL.split(",")[1]);
      } catch (e) {
        reject(new Error("Canvas toDataURL failed"));
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
  });
};

/**
 * Performs AI-powered virtual try-on by synthesizing a product image onto a user's photo.
 * Multi-tier execution architecture:
 * 1. Tier 1: Try Fal.ai IDM-VTON if process.env.FAL_KEY is defined.
 * 2. Tier 2: Try Gemini generateContent multimodal (gemini-2.5-flash-image).
 * 3. Tier 3: Fall back to high-fidelity local Canvas holographic/AR mapping synthesis.
 */
export const virtualTryOn = async (userImageBase64: string, productImageUrl: string, productTitle: string, size: string = 'M'): Promise<string> => {
  try {
    console.log("Initiating VTRO Try-On from Kaggle API...");
    
    // 1. User ki photo (Base64) aur Product Image (URL) ko Blob (File) mein convert karna
    const resHuman = await fetch(userImageBase64);
    const blobHuman = await resHuman.blob();
    
    const resGarment = await fetch(productImageUrl);
    const blobGarment = await resGarment.blob();
    
    // 2. FormData banana taake File upload ho sake
    const formData = new FormData();
    formData.append("person_image", blobHuman, "person.jpg");
    formData.append("garment_image", blobGarment, "garment.jpg");
    
    // 👇 YAHAN APNA KAGGLE WALA LINK DAALEIN
    const KAGGLE_API_URL = "https://scheduled-maker-file-camera.trycloudflare.com/try-on"; 
    
    // 3. Kaggle API ko request bhejna
    const response = await fetch(KAGGLE_API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errText = await response.text();
      console.error("KAGGLE API ERROR:", errText);
      throw new Error(`API failed with status: ${response.status} - ${errText}`);
    }
    
    // 4. Result image (Blob) ko URL mein convert karke wapas bhejna
    const resultBlob = await response.blob();
    return URL.createObjectURL(resultBlob);
    
  } catch (error) {
    console.error("VTRO Kaggle API Error:", error);
    throw error;
  }
};

export interface FitSizeReport {
  recommendedSize: string;
  narrative: string;
  fitStatus: string;
  sizeBreakdown: {
    size: string;
    fitLevel: number; // 0 to 100
    verdict: string;
  }[];
}

export const getAiFitAnalysis = async (
  productTitle: string,
  category: string,
  availableSizes: string[],
  heightCm: number,
  weightKg: number,
  fitPreference: 'slim' | 'regular' | 'oversized',
  selectedSize: string
): Promise<FitSizeReport> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are AFSANA's Smart Biometric Fit AI.
Analyze the fit of "${productTitle}" (Category: "${category}", available sizes: ${JSON.stringify(availableSizes)}) for a person who is:
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Preferred style: "${fitPreference}"
- Selected trying/buying size: "${selectedSize}"

Your job is to evaluate if they selected the right size or if it will be too big/small.
Return a JSON containing:
1. "recommendedSize": The perfect size for them among the available list.
2. "narrative": A high-end streetwear stylist analysis. Speak in an incredibly cool, engaging, friendly, and trendy blend of English and Roman Urdu (Hinglish/Urdish) to make it highly personalized and fun! Address them as "Bhai" or "Yaar" (e.g., "Yaar, for your 180cm height, Size M perfect fit to dega standard cuts me, par direct streetwear slouchy silhouette ke liye Size L absolute banger rahega. Medium loge to..." or similar relatable streetwear style advice). Tell them exactly what will happen to the drape/sleeves/width if the size is too big or small!
3. "fitStatus": A short summary status of the currently selected size "${selectedSize}" (e.g., "Slightly tight / Tight fit", "Aesthetic Drop / Ideal Fit", "Excessive Baggy / Too Large", etc.).
4. "sizeBreakdown": An array of objects for each of the available sizes, showing a "size", a "fitLevel" (percentage 0-100 of how good it is), and a short Urdu/English "verdict" (e.g. "Too short / Chota", "Comfortable / Perfect fitted", "Clean Drape / Sahi Drop", "Too loose / Bohot baggy").

Do not return markdown, just the JSON string matching the keys: recommendedSize, narrative, fitStatus, sizeBreakdown.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSize: { type: Type.STRING },
            narrative: { type: Type.STRING },
            fitStatus: { type: Type.STRING },
            sizeBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  size: { type: Type.STRING },
                  fitLevel: { type: Type.INTEGER },
                  verdict: { type: Type.STRING }
                },
                required: ["size", "fitLevel", "verdict"]
              }
            }
          },
          required: ["recommendedSize", "narrative", "fitStatus", "sizeBreakdown"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as FitSizeReport;
  } catch (error) {
    console.error("Fit Sizing AI analysis failed:", error);
    
    // Highly accurate client-side fallback if Gemini fails
    const isBottoms = category.toLowerCase().includes('pant') || category.toLowerCase().includes('cargo');
    let recommended = availableSizes[1] || 'M';
    let label = '';
    
    if (isBottoms) {
      if (weightKg < 65) recommended = '30';
      else if (weightKg < 75) recommended = '32';
      else if (weightKg < 87) recommended = '34';
      else recommended = '36';
    } else {
      if (heightCm < 170) recommended = 'S';
      else if (heightCm < 179) recommended = 'M';
      else if (heightCm < 187) recommended = 'L';
      else recommended = 'XL';
    }

    // Apply fit pref modification if index shifting works
    const recIdx = availableSizes.indexOf(recommended);
    if (recIdx !== -1) {
      if (fitPreference === 'slim' && recIdx > 0) recommended = availableSizes[recIdx - 1];
      if (fitPreference === 'oversized' && recIdx < availableSizes.length - 1) recommended = availableSizes[recIdx + 1];
    }

    const narrative = `Bhai, look: heights are around ${heightCm}cm and weights are ${weightKg}kg. Selected size is ${selectedSize}. As standard for AFSANA ${productTitle}, we suggest **Size ${recommended}** for your desired "${fitPreference}" fit. Aggar aap chota side select keroge to shoulder seam upar charh jayega, aur aggar bohot bara louge to fitting loose hojayegi! Choose wisely.`;

    return {
      recommendedSize: recommended,
      narrative,
      fitStatus: selectedSize === recommended ? "Ideal Drape" : "Variant Silhouette",
      sizeBreakdown: availableSizes.map(s => {
        let fitLcl = s === recommended ? 95 : (s === selectedSize ? 80 : 50);
        return {
          size: s,
          fitLevel: fitLcl,
          verdict: s === recommended ? "Perfect Match" : (s === selectedSize ? "Styled Alternative" : "Not Fit")
        };
      })
    };
  }
};

