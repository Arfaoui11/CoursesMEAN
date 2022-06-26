import { useEffect } from "react"


// components

import {useCoursesContext} from "../hooks/userCoursesContext";

import CoursesForm from "../components/CoursesForm";
import CoursesDetails from "../components/CoursesDetails";

const Home = () => {
    const { courses, dispatch } = useCoursesContext()

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await fetch('/api/courses')
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_COURSES', payload: json})
            }
        }

        fetchCourses()
    }, [dispatch])

    return (
        <div className="home">
            <div className="courses">
                {courses && courses.map(courses => (
                    <CoursesDetails courses={courses} key={courses._id} />
                ))}
            </div>
            <CoursesForm />
        </div>
    )
}

export default Home