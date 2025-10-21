// Next.js compatibility wrappers for React Router
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import type { LinkProps as RouterLinkProps } from "react-router-dom";
import React from "react";

// Link component wrapper
interface LinkProps extends Omit<RouterLinkProps, "to"> {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, children, ...props }, ref) => {
  // External links
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} ref={ref} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={href} ref={ref} {...props}>
      {children}
    </RouterLink>
  );
});

Link.displayName = "Link";

// useRouter hook wrapper
export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
  };
}

// usePathname hook wrapper
export function usePathname() {
  const location = useLocation();
  return location.pathname;
}
