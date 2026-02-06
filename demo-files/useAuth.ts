import { api } from '@/lib/api';
import type { AuthToken, User } from '@/types/auth';
import { useCallback, useState } from 'react';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const validated = loginSchema.parse(credentials);
      const response = await api.post<{ user: User; token: AuthToken }>('/auth/login', validated);

      setState({
        user: response.user,
        token: response.token,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setState(initialState);
    api.post('/auth/logout');
  }, []);

  return {
    ...state,
    login,
    logout,
    isAuthenticated: !!state.token,
  };
}

export default useAuth;
