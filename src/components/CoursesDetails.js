import {useCoursesContext} from "../hooks/userCoursesContext";

const CoursesDetails = ({courses}) => {

    const { dispatch } = useCoursesContext()

    const handleClick = async () => {
        const response = await fetch('/api/courses/' + courses._id, {
            method: 'DELETE'
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_COURSE', payload: json})
        }
    }


    return (
        <div className="courses-details">
            <h4>{courses.title}</h4>
            <p><strong> nbrHeures :</strong>{courses.nbrHeures}</p>
            <p><strong> niveau :</strong>{courses.niveau}</p>
            <p><strong> nbrMaxParticipant :</strong>{courses.nbrMaxParticipant}</p>
            <p><strong> frais :</strong>{courses.frais}</p>
            <p><strong> dateDebut :</strong>{courses.dateDebut}</p>
            <p><strong> dateFin :</strong>{courses.dateFin}</p>
            <p>{courses.createdAt}</p>
            <span onClick={handleClick}>delete</span>
        </div>
    )
}

export default CoursesDetails