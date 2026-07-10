import { useGetPermissionsQuery } from "./permissionsApi";
import { Permission } from "./types";

export const usePermissions = () => {
  const { data: permissions = [] } = useGetPermissionsQuery();
  const hasPermission = ({ name, path, method }: Permission): boolean => {
    return permissions.some(
      (p: Permission) =>
        p.name === name && p.path === path && p.method === method,
    );
  };

  return { hasPermission };
};
