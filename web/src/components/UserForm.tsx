import { DocumentNode } from "graphql";
import { User } from "../types";
import { useMutation } from "@apollo/client";

export function UserForm({
  id,
  name,
  email,
  onSuccess,
  query,
  submitText,
  inputRef,
}: Partial<User> & {
  submitText: string;
  onSuccess: () => void;
  query: DocumentNode;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}) {
  const [mutateUserList] = useMutation(query, {
    refetchQueries: ["GetUsers"],
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const object = {};
    formData.forEach((value, key) => (object[key] = value));
    // Since Edit query requires us to send an id, we will conditionally send an id
    // prop based on the current existance of an id on the default values coming from props
    const conditionalId = id ? { id } : {};
    mutateUserList({
      variables: { user: { ...object, ...conditionalId } },
    }).then(() => {
      onSuccess();
    });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <label>
        <span>Username:</span>
        <input ref={inputRef} defaultValue={name} name="name" />
      </label>
      <label>
        <span>Email:</span>
        <input defaultValue={email} name="email" />
      </label>
      <button type="submit">{submitText}</button>
    </form>
  );
}
