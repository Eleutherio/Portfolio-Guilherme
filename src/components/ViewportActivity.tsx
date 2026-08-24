import { createContext, useContext, type ReactNode } from "react";

const ViewportActivityContext = createContext(true);

export function ViewportActivityProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <ViewportActivityContext.Provider value={active}>{children}</ViewportActivityContext.Provider>
  );
}

export function useViewportActivity() {
  return useContext(ViewportActivityContext);
}
