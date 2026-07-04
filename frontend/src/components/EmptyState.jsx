import { FileQuestion } from 'lucide-react';

export default function EmptyState({ title = "No data found", message = "There is currently nothing to show here." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border border-borderLight rounded-xl border-dashed my-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
        <FileQuestion size={32} />
      </div>
      <h3 className="text-lg font-bold text-textPrimary">{title}</h3>
      <p className="text-sm text-textSecondary mt-2 max-w-sm">{message}</p>
    </div>
  );
}
