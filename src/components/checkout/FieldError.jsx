export default function FieldError({ error }) {
  if (!error) return null;
  return <div className="mt-1 text-xs text-red-500">{error}</div>;
}
