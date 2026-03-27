export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m atrás`;
  if (diffHour < 24) return `${diffHour}h atrás`;

  // Se for deste ano, mostra "18 de mar"
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getDate()} de ${date.toLocaleString("pt-BR", { month: "short" })}`;
  }
  // Se for de outro ano, mostra "18 de mar de 2025"
  return `${date.getDate()} de ${date.toLocaleString("pt-BR", { month: "short" })} de ${date.getFullYear()}`;
}