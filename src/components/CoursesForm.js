import { useState } from 'react'
import {useCoursesContext} from "../hooks/userCoursesContext";


const CoursesForm = () => {
    const { dispatch } = useCoursesContext()

    const [title, setTitle] = useState('')
    const [niveau, setNiveau] = useState('')
    const [nbrHeures, setNbrHeures] = useState('')
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [nbrMaxParticipant, setNbrMaxParticipant] = useState('')
    const [frais, setFrais] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const courses = {title, niveau, nbrHeures,dateDebut,dateFin,nbrMaxParticipant,frais}

        const response = await fetch('/api/courses', {
            method: 'POST',
            body: JSON.stringify(courses),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setError(null)
            setTitle('')
            setNiveau('')
            setNbrHeures('')
            setDateDebut('')
            setDateFin('')
            setNbrMaxParticipant('')
            setFrais('')
            dispatch({type: 'CREATE_COURSE', payload: json})
        }

    }

    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add a New Courses</h3>

            <label> Title: </label>
            <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <label>Niveau :</label>
            <select    onChange={(e) => setNiveau(e.target.value)}
                       value={niveau} >

                <option value="INTERMEDIAIRE">INTERMEDIAIRE</option>
                <option value="AVANCE">AVANCE</option>
                <option  value="DEBUTANT">DEBUTANT</option>
              </select>

            <label>nbrHeures :</label>

            <input
                type="number"
                onChange={(e) => setNbrHeures(e.target.value)}
                value={nbrHeures}
            />

            <label>nbrMaxParticipant :</label>
            <input
                type="number"
                onChange={(e) => setNbrMaxParticipant(e.target.value)}
                value={nbrMaxParticipant}
            />

            <label>dateDebut :</label>
            <input
                type="date"
                onChange={(e) => setDateDebut(e.target.value)}
                value={dateDebut}
            />

            <label>dateFin :</label>
            <input
                type="date"
                onChange={(e) => setDateFin(e.target.value)}
                value={dateFin}
            />

            <label>Frais:</label>
            <input
                type="number"
                onChange={(e) => setFrais(e.target.value)}
                value={frais}
            />

            <button>Add Workout</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default CoursesForm