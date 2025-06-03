export const createNavigationHandler =
  (target: "add" | "edit" | "delete", onSwitch: (view: "add" | "edit" | "delete") => void) =>
  (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSwitch(target);
  };
