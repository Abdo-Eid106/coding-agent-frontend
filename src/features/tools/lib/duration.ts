/**
 * Calculates and formats the duration between startedAt and finishedAt in seconds.
 * Returns null if either timestamp is missing or invalid.
 */
export function formatToolDuration(
  startedAt?: Date | string | null,
  finishedAt?: Date | string | null,
): string | null {
  if (!startedAt || !finishedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();

  if (isNaN(start) || isNaN(end) || end < start) return null;

  const diffSec = (end - start) / 1000;

  if (diffSec < 0.01) {
    return "<0.01s";
  }
  if (diffSec < 1) {
    return `${parseFloat(diffSec.toFixed(2))}s`;
  }
  return `${parseFloat(diffSec.toFixed(1))}s`;
}
