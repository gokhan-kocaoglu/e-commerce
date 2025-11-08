export default function ErrorBanner({
  message = "Bir şeyler ters gitti.",
  onRetry,
}) {
  return (
    <div className="mx-auto max-w-7xl my-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center rounded bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  );
}
