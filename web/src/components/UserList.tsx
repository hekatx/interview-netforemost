import { useMutation } from "@apollo/client";
import { User } from "../types";
import { AddUserRow } from "./AddUserRow";
import { DELETE_USER, EDIT_USER } from "../schemas/user";
import { useRef, useState } from "react";
import { UserForm } from "./UserForm";
import { flushSync } from "react-dom";

export function UserList({ users }: { users: User[] }) {
  return (
    <ul className="user-list">
      {users.map((user: User) => (
        <UserRow
          key={user.id}
          id={user.id}
          name={user.name}
          email={user.email}
        />
      ))}
      <AddUserRow />
    </ul>
  );
}

function UserRow(props: { id: string; name: string; email: string }) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [mode, setMode] = useState<"idle" | "editing">("idle");

  const onEdit = () => {
    flushSync(() => setMode("editing"));
    ref.current?.focus();
  };
  return mode === "idle" ? (
    <UserInformation {...props} onEdit={onEdit} />
  ) : mode === "editing" ? (
    <UserForm
      {...props}
      inputRef={ref}
      onSuccess={() => setMode("idle")}
      submitText="Edit"
      query={EDIT_USER}
    />
  ) : null;
}

function UserInformation({
  id,
  name,
  email,
  onEdit,
}: Partial<User> & { onEdit: () => void }) {
  const [deleteUser] = useMutation(DELETE_USER, {
    variables: { deleteUserId: id },
    refetchQueries: ["GetUsers"],
  });
  return (
    <li>
      <img src="https://picsum.photos/30/30" width={30} height={30} />
      <span>{name}</span>
      <span className="email">{email}</span>

      <div className="actions">
        <button onClick={onEdit}>Edit</button>
        <button
          className="warn"
          onClick={async () => {
            const s = await deleteUser();
            console.log(s);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
