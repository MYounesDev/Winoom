export const getUsers = async () => {
    const response = await fetch('http://localhost:3001/users');
    const data = await response.json();
    return data;
  };
  