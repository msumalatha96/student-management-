
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/api/students'

function App() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadStudents() {
    try {
      setError('')
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load student records.')
      }

      setStudents(await response.json())
    } catch {
      setError('Cannot connect to the backend. Please check that the API is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  async function addStudent(event) {
    event.preventDefault()

    if (!name.trim() || !course.trim()) return

    try {
      setSaving(true)
      setError('')

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          course: course.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Could not add the student.')
      }

      const newStudent = await response.json()
      setStudents((current) => [...current, newStudent])
      setName('')
      setCourse('')
    } catch (err) {
      setError(err.message || 'Failed to add student.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteStudent(id) {
    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Could not delete the student.')
      }

      setStudents((current) =>
        current.filter((student) => student.id !== id),
      )
    } catch (err) {
      setError(err.message || 'Failed to delete student.')
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <p className="eyebrow">STUDENT PORTAL</p>
        <h1>Student Management System</h1>
        <p className="subtitle">
          Manage student records in one place.
        </p>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
        <div className="stat-card">
          <span>System Status</span>
          <strong className="status">Student Portal</strong>
        </div>
      </section>

      {error && (
        <div className="error" role="alert">
          {error}
          <button className="retry" onClick={loadStudents}>
            Retry
          </button>
        </div>
      )}

      <section className="panel">
        <h2>Add a Student</h2>
        <form onSubmit={addStudent}>
          <label htmlFor="name">Student Name</label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter student name"
            required
          />

          <label htmlFor="course">Course</label>
          <input
            id="course"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="e.g. Computer Science"
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="table-heading">
          <h2>Student Records</h2>
          <span className="count">{students.length} records</span>
        </div>

        {loading ? (
          <p className="empty">Loading student records...</p>
        ) : students.length === 0 ? (
          <p className="empty">
            No students found. Add your first student above.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>
                      <button
                        className="delete"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer>
        Student Management System · React · FastAPI · Docker · Nginx
      </footer>
    </main>
  )
}

export default App