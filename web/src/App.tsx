import "./App.css";
import { GET_USERS } from "./schemas/user";
import { useQuery } from "@apollo/client";
import { UserList } from "./components/UserList";

function App() {
  const { loading, error, data } = useQuery(GET_USERS);

  console.log(data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <section className="container">
      <h1>Users</h1>
      <UserList users={data?.users ?? []} />
    </section>
  );
}

export default App;
