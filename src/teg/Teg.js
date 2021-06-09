import { useEffect } from 'react';
const axios = require('axios');

async function getUsuarios() {
  try {
    const response = await axios.get('https://teg-node.herokuapp.com/usuarios');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function Teg() {

  useEffect(() => {
    getUsuarios()
  });

  return (
    <div>
      asd
    </div>
  );
}

export default Teg;
