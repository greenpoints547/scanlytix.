import { useApp } from "../context/AppContext.jsx";

export default function Toast() {
  const { msg } = useApp();
  return <div id="toast" role="status" className={msg ? "on" : ""}>{msg}</div>;
}
