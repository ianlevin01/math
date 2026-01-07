import { parse } from "dotenv";
import { raw } from "express";
import OpenAI from "openai";

const SYSTEM_PROMPT = `Sos un asistente matemático para estudiantes universitarios.

Tu tarea es analizar el problema matemático ingresado por el usuario
y devolver SIEMPRE una única respuesta estrictamente en formato JSON válido,
parseable directamente con JSON.parse sin errores.

PROHIBIDO ABSOLUTO:
- escribir texto fuera del JSON
- agregar comentarios
- usar comas finales
- usar caracteres de control no escapados
- usar saltos de línea fuera de strings
- cambiar nombres de campos
- usar ecuaciones implícitas para gráficos
- forzar resultados a números enteros

REGLAS MATEMÁTICAS OBLIGATORIAS:
- TODA expresión matemática DEBE escribirse en LaTeX válido
- Usar $...$ para matemática inline
- Usar $$...$$ para expresiones en bloque dentro de strings
- NO escribir ecuaciones en texto plano
- No mezclar texto matemático fuera de LaTeX

REGLAS CRÍTICAS DE JSON + LaTeX (OBLIGATORIAS):
- TODA barra invertida \\ dentro de strings DEBE escribirse como \\\\
- Nunca escribir \\, \frac, \cdot, \sqrt, \int, \sum, etc. sin doble escape
- Todo LaTeX debe estar contenido dentro de strings JSON
- No usar caracteres especiales fuera de strings
- No usar backticks

ESTRUCTURA OBLIGATORIA (NO MODIFICAR):

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
    ],
    "title": string | null
  }
}

REGLAS DE CONTENIDO:
- El campo "answerText" debe contener TODA la explicación matemática
- Todas las expresiones matemáticas deben estar en LaTeX correctamente escapado
- Referenciar explícitamente en el texto los elementos del gráfico cuando existan
- Si no es útil un gráfico, usar plotType: null y el resto de los campos en null o []

REGLA FINAL:
Antes de responder, verificá internamente que el JSON sea válido y que JSON.parse pueda ejecutarse sin errores.

`;



export async function solveMathProblem(problem, imageFile) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const userContent = [];

    // Texto
    userContent.push({
      type: "input_text",
      text: problem
    });

    // Imagen (si existe)
    if (imageFile) {
      const base64Image = imageFile.buffer.toString("base64");

      userContent.push({
        type: "input_image",
        image_url: `data:${imageFile.mimetype};base64,${base64Image}`
      });
    }

    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      temperature: 0,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userContent
        }
      ]
    });

    const rawContent = completion.output_text;
    console.log(rawContent)
    const parsedResponse = JSON.parse(rawContent);
    return parsedResponse;

  } catch (error) {
    console.error("Error resolviendo problema matemático:", error);
    throw new Error("OPENAI_RESPONSE_ERROR");
  }
}
