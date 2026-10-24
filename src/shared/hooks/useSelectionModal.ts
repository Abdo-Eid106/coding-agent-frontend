import { useState } from "react";

export interface SelectionModal<T> {
  selected: T | null;
  isOpen: boolean;
  open: (item: T) => void;
  close: () => void;
}

export function useSelectionModal<T>(): SelectionModal<T> {
  const [selected, setSelected] = useState<T | null>(null);

  const open = (item: T) => {
    setSelected(item);
  };

  const close = () => {
    setSelected(null);
  };

  return {
    selected,
    isOpen: selected !== null,
    open,
    close,
  };
}
