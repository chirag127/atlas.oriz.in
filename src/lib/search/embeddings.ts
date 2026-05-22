export async function generateEmbedding(
  text: string
): Promise<number[]> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY ?? ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text.slice(0, 1000) }),
      }
    );

    if (!response.ok) return [];

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as number[];
    }
    return [];
  } catch {
    return [];
  }
}
