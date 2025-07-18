

export function formatRoleName(role: string): string {
  if (!role || typeof role !== "string") return "";

  return role
    .toLowerCase()
    .split("_")  
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
