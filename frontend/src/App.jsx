import { useEffect, useState } from 'react'
import './App.css'
import api from './api';

function App() {
  const [ students, setStudents ] = useState([]);
  const [ name, setName ] = useState('');
  const [ registration_number, setregistration_number] = useState('');

  useEffect(() => {
    fetchStudents();
  },[]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);

    } catch(error) {
      console.log("Students cannot be fetched", error);

    }
    
  };

  const addStudent = async () => {
    try {
      const response = await api.post('/students', {
        name: name.trim(),
        registration_number: registration_number.trim()
      });
      setStudents((currentStudents) => [...currentStudents, response.data]);

      return true;

    } catch(error) {
      alert("Student cannot be added", error);
      return false
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(name.trim() && registration_number.trim()) {
      const success = await addStudent();

      if(success) {
        setName('');
        setregistration_number('');

      }
    }
  };

  return (
    <>
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        name='name' 
        value={name} 
        placeholder="Enter Student's name..." 
        onChange={(e) => setName(e.target.value)}/>

        <input 
        type="text" 
        name='registration_number' 
        value={registration_number} 
        placeholder="Enter Student's registration number..."
        onChange={(e) => setregistration_number(e.target.value)}/>

        <button>Add Student</button>

      </form>

    </div>

    {/* students list */}
    <div>
      <h3>Students List</h3>
      {
        students.length === 0 ? (<p>No student found</p> ): (
          <ul>
            { students.map((student) => (
              <li key={student.id}>                {student.name}-{student.registration_number}</li>
            ))}
          </ul>
        )
      }
    </div>
    
    </>
  )
}

export default App
