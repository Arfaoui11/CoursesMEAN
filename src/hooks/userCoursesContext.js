
import { useContext } from "react"
import {CoursesContext} from "../context/CoursesContext";

export const useCoursesContext = () => {
    const context = useContext(CoursesContext)

    if(!context) {
        throw Error('useCoursesContext must be used inside an CoursesContextProvider')
    }

    return context
}