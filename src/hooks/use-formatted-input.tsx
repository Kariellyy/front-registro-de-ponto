import { useCallback, useState } from "react";

export const useFormattedInput = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);

  const formatCNPJ = useCallback((input: string) => {
    // Remove tudo que não é número
    const numbers = input.replace(/\D/g, "");

    // Limita a 14 dígitos
    const limited = numbers.slice(0, 14);

    // Aplica a formatação: XX.XXX.XXX/XXXX-XX
    if (limited.length <= 2) return limited;
    if (limited.length <= 5)
      return `${limited.slice(0, 2)}.${limited.slice(2)}`;
    if (limited.length <= 8)
      return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(
        5
      )}`;
    if (limited.length <= 12)
      return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(
        5,
        8
      )}/${limited.slice(8)}`;
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(
      5,
      8
    )}/${limited.slice(8, 12)}-${limited.slice(12)}`;
  }, []);

  const handleCNPJChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCNPJ(e.target.value);
      setValue(formatted);
    },
    [formatCNPJ]
  );

  const getCNPJNumbers = useCallback(() => {
    return value.replace(/\D/g, "");
  }, [value]);

  return {
    value,
    setValue,
    handleCNPJChange,
    getCNPJNumbers,
  };
};
