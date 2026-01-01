import OpenAI from "openai";
const SYSTEM_PROMPT = `
Sos un asistente matemático para estudiantes universitarios.

Tu tarea es analizar el problema matemático ingresado por el usuario
y devolver SIEMPRE una única respuesta estrictamente en formato JSON válido.

PROHIBIDO:
- escribir texto fuera del JSON
- usar markdown
- agregar comentarios
- agregar campos extra
- cambiar nombres de campos
- usar ecuaciones implícitas para gráficos

La respuesta DEBE tener EXACTAMENTE esta estructura:

{
  "answerText": string,
  "plotSpec": {
    "plotType": "surface" | "contour" | "curve" | null,
    "function": string | null,
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

REGLAS IMPORTANTES:

PRIMORDIAL:
El JSON debe ser válido según JSON estándar.

NO usar expresiones simbólicas.
Todas las fracciones deben evaluarse a números decimales.

1) "answerText" debe contener una explicación breve y clara.

2) "plotSpec" debe ser null SOLO si el problema no admite gráfico.

3) Si "plotType" es "surface":
   - "function" DEBE ser una función explícita z = f(x,y)
   - "function" SOLO puede contener x e y
   - Está TERMINANTEMENTE PROHIBIDO usar la variable z en "function"
   - Ejemplo válido: "sqrt(1 + x^2 + y^2)"
   - Ejemplo inválido: "z^2 - x^2 - y^2"

4) "function" debe ser compatible con evaluación numérica.

5) "xRange" y "yRange" deben cubrir la región relevante.

6) "grid.nx" y "grid.ny" deben estar entre 40 y 120.

7) "overlays" debe incluir puntos relevantes si existen.
   Si no existen, devolver [].

8) "plotType":
   - "surface" → z = f(x,y)
   - "contour" → curvas de nivel
   - "curve" → función de una variable

Si el problema describe una superficie implícita:
- Despejar z explícitamente si es posible
- Si NO es posible, devolver "plotSpec": null

Recordá: la salida debe ser SOLO el JSON.

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
      model: "gpt-4o-mini",
      temperature: 0,
      messages: messagesForAI
    });

    const rawContent = completion.choices[0].message.content;
    // 🔐 Parseo estricto: si no es JSON, falla
    const parsedResponse = JSON.parse(rawContent);
    console.log(parsedResponse)
    return parsedResponse;

  } catch (error) {
    console.error("Error resolviendo problema matemático:", error);
    throw new Error("OPENAI_RESPONSE_ERROR");
  }
}
