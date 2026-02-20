// Fun Spanish greetings used on the dashboard
export const GREETINGS = [
    "¡Qué pedo, carnal!",
    "¡Qué onda, compa!",
    "¡Hola, campeón!",
    "¡Buenas, crack!",
    "¡Epa, amigo!",
    "¡Saludos, jefe!",
    "¡Hey, colega!",
] as const

export function getRandomGreeting(): string {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
}
