import { Redirect, Slot } from "expo-router";
import { useSession } from "../../context/AuthContext";

export default function AuthRoutesLayout() {
  const { session } = useSession();

  if (session) {
    return <Redirect href={"/"} />;
  }

  return <Slot />;
}
