import { useEffect, useState } from 'react'
import './App.css'
import api from './api';

function App() {
  const [ students, setStudents ] = useState([]);
  const [ name, setName ] = useState('');
  const [ registration_number, setregistration_number] = useState('');
  const [ editingId, setEditingId ] = useState(null);

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

  // update student
  const updateStudent = async () => {
    try {
      const response = await api.put(`/students/${editingId}`, {
        name: name.trim(),
        registration_number: registration_number.trim()
      });
      setStudents(currentStudents => currentStudents.map((student) => student.id === editingId ? response.data: student));

      setEditingId(null);
      setName('');
      setregistration_number('');

    } catch (error) {
      console.log('Error updating the student', error);

    }

  };

  // cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setregistration_number(''); 

  };

  // delete student
  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(student => student.id !== id));

    } catch (error) {
      console.log('Error deleting the student', error);

    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !registration_number.trim()) {
      return;

    }

    if(editingId !== null) {
      await updateStudent();

    } else {
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

        {/* the 2 buttons will render/show only if the left condition is true */}
        { editingId !== null && (
          <>
          <button onClick={updateStudent}>Update Student</button>
          <button onClick={cancelEdit}>Cancel</button>
          </>
        )}

      </form>

    </div>

    {/* students list */}
    <div className='list'>
      <h3>Students List</h3>
      {
        students.length === 0 ? (<p>No student found</p> ): (
          <ul>
            { students.map((student) => (
              <li key={student.id}>{student.name}-{student.registration_number}
              <button onClick={() =>{ 
                setEditingId(student.id)
                setName(student.name)
                setregistration_number(student.registration_number)
              }
              }>Edit</button>
              <button onClick={() => deleteStudent(student.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
    
    </>
  )
}

export default App
