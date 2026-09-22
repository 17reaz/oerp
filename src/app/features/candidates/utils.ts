export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");

  return initials.join("") || "?";
}

export function getStatusColor(value: string | null | undefined): {
  bg: string;
  text: string;
} {
  const normalized = (value || "").toLowerCase();

  if (
    normalized.includes("complete") ||
    normalized.includes("approved")
  ) {
    return {
      bg: "#E7F7EE",
      text: "#1A9A5B",
    };
  }

  if (
    normalized.includes("hold") ||
    normalized.includes("cancel") ||
    normalized.includes("reject")
  ) {
    return {
      bg: "#FDECEC",
      text: "#D3453B",
    };
  }

  if (
    normalized.includes("processing") ||
    normalized.includes("progress") ||
    normalized.includes("pending")
  ) {
    return {
      bg: "#FFF4E0",
      text: "#B7791F",
    };
  }

  return {
    bg: "#F2F2F3",
    text: "#555",
  };
}