export default function AddressPreviewCard({ address }) {
  if (!address) return null;

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-1 text-xs font-medium text-slate-500">
      <p>{address.fullName}</p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p>{address.countryCode}</p>
    </div>
  );
}
