import { useMemo } from 'react';

/**
 * Hook to check if a string starts with a Hebrew character (RTL)
 * @param value - The string to check
 * @returns true if the string starts with a Hebrew character, false otherwise
 */
export function useIsValueRtl(value: string): boolean {
  return useMemo(() => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return false;

    const firstChar = trimmedValue[0];
    const charCode = firstChar.charCodeAt(0);

    // Hebrew Unicode range: 0x0590 - 0x05FF
    return charCode >= 0x0590 && charCode <= 0x05FF;
  }, [value]);
}
