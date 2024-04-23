import { useRef, useState } from "react";
import { UserForm } from "./UserForm";
import { ADD_USER } from "../schemas/user";
import { flushSync } from "react-dom";

function AddUserButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="addUser-button" onClick={onClick}>
      + Add user
    </button>
  );
}

export function AddUserRow() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<"idle" | "adding" | "done">("idle");
  const showUserForm = () => {
    flushSync(() => setMode("adding"));
    ref.current?.focus();
  };
  const onDone = () => {
    setMode("done");
  };
  return mode === "idle" || mode === "done" ? (
    <AddUserButton onClick={showUserForm} />
  ) : mode === "adding" ? (
    <UserForm
      inputRef={ref}
      name=""
      email=""
      onSuccess={onDone}
      submitText="Add"
      query={ADD_USER}
    />
  ) : null;
}
