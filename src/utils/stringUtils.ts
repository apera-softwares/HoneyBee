

export function formatRoleName(role: string): string {
  if (!role || typeof role !== "string") return "";

  return role
    .toLowerCase()
    .split("_")  
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export function capitalizeWord(word: string | null | undefined): string {
  if (typeof word !== 'string' || word.trim() === '') return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
