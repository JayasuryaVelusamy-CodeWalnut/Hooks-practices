import { useRef, useEffect, useCallback, useState } from 'react';

const GENERIC_ASYNC_ERROR_MESSAGE = 'An error occurred';

interface AsyncState<T> {
  value: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAsyncResult<T, TArgs extends readonly unknown[]> {
  value: T | null;
  isLoading: boolean;
  error: Error | null;
  execute: (...args: TArgs) => Promise<T>;
}

/**
 * Custom hook for managing async operation state (value, isLoading, error).
 * Prevents out-of-order responses from overwriting newer results using request IDs.
 *
 * @template T - The type of data returned by the async function
 * @template TArgs - The argument types for the async function
 * @param asyncFunction - Function returning a promise for the async work
 * @param immediate - When true, executes once on mount. Only allowed for 0-arg functions
 * @returns Object containing value, isLoading, error states and execute function
 *
 * @example
 * // Immediate execution on mount (0-arg function only)
 * const { value, isLoading, error } = useAsync(() => fetchUser());
 *
 * @example
 * // Manual execution with arguments
 * const { execute } = useAsync((userId: string) => fetchUser(userId), false);
 * // Later: const result = await execute('123');
 */

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate?: true
): UseAsyncResult<T, []>;

export function useAsync<T, TArgs extends readonly unknown[]>(
  asyncFunction: (...args: TArgs) => Promise<T>,
  immediate: false
): UseAsyncResult<T, TArgs>;

export function useAsync<T, TArgs extends readonly unknown[] = []>(
  asyncFunction: (...args: TArgs) => Promise<T>,
  immediate = true
): UseAsyncResult<T, TArgs> {
  const [state, setState] = useState<AsyncState<T>>({
    value: null,
    isLoading: false,
    error: null,
  });

  const asyncFunctionRef = useRef(asyncFunction);
  const latestRequestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: TArgs): Promise<T> => {
    const requestId = ++latestRequestIdRef.current;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await asyncFunctionRef.current(...args);

      if (isMountedRef.current && requestId === latestRequestIdRef.current) {
        setState({
          value: response,
          isLoading: false,
          error: null,
        });
      }

      return response;
    } catch (caughtError: unknown) {
      let error: Error;
      if (caughtError instanceof Error) {
        error = caughtError;
      } else {
        error = new Error(GENERIC_ASYNC_ERROR_MESSAGE);
        (error as Error & { cause?: unknown }).cause = caughtError;
      }

      if (isMountedRef.current && requestId === latestRequestIdRef.current) {
        setState({
          value: null,
          isLoading: false,
          error,
        });
      }

      throw error;
    }
  }, []);

  useEffect(() => {
    if (!immediate) return;
    (execute as () => Promise<T>)().catch(() => {
      // Error is handled in state; no action needed here
    });
  }, [execute, immediate]);

  return {
    value: state.value,
    isLoading: state.isLoading,
    error: state.error,
    execute,
  };
}
