import { ReactNode, createContext, useContext, useMemo } from 'react';
import { AccessCode } from '@fepkg/services/access-code';
import { User } from '@fepkg/services/types/common';
import { useOdmLiveAccessQuery } from '@/hooks/useOdmLiveAccessQuery';

type AuthContextType = {
  user?: User;
  access?: Set<AccessCode>;
};

export const AuthContext = createContext<AuthContextType>({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { access, user } = useOdmLiveAccessQuery();
  const value = useMemo(() => ({ user, access }), [access, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
