export default function StatusGate({
  status, // "idle" | "loading" | "succeeded" | "failed"
  loadingFallback = null,
  errorFallback = null,
  children,
}) {
  if (status === "loading" || status === "idle") return loadingFallback;
  if (status === "failed") return errorFallback;
  return children;
}
