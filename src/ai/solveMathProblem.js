import OpenAI from "openai";
const SYSTEM_PROMPT = `Sos un asistente matemático para estudiantes universitarios.

Tu tarea es analizar el problema matemático ingresado por el usuario
y devolver SIEMPRE una única respuesta estrictamente en formato JSON válido.

PROHIBIDO:
- escribir texto fuera del JSON
- usar markdown
- agregar comentarios
- agregar campos extra
- cambiar nombres de campos
- usar ecuaciones implícitas para gráficos
- forzar resultados a números enteros

La respuesta DEBE tener EXACTAMENTE esta estructura:

{
  "answerText": string,
  "plotSpec": {
    "plotType": "surface" | "contour" | "curve" | null,
    "functions": [
      {
        "expression": string,
        "label": string
      }
    ] | null,
    "xRange": [number, number] | null,
    "yRange": [number, number] | null,
    "grid": { "nx": number, "ny": number } | null,
    "overlays": [
      {
        "type": "point",
        "x": number,
        "y": number,
        "label": string
      }
    ] | [],
    "title": string | null
  }
}

`;

export async function solveMathProblem(problem) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const messagesForAI = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: problem }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0,
      messages: messagesForAI
    });

    const rawContent = completion.choices[0].message.content;
    // 🔐 Parseo estricto: si no es JSON, falla
    const parsedResponse = JSON.parse(rawContent);
    console.log(parsedResponse.plotSpec.overlays)
    return parsedResponse;

  } catch (error) {
    console.error("Error resolviendo problema matemático:", error);
    throw new Error("OPENAI_RESPONSE_ERROR");
  }
}
