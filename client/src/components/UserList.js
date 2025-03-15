import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Kullanıcılar:</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.role}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
