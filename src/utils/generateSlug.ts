export function generateSlug(text: string) {
    return text
        .normalize("NFD") // Normaliza para decomposição de caractere
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .toLowerCase() // Converte para minúsculas
        .replace(/[^\w\s-]/g, "") // Remove símbolos exceto espaço e hífen
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/--+/g, "-") // Remove múltiplos hífens
        .trim(); // Remove espaços no início e no fim
}