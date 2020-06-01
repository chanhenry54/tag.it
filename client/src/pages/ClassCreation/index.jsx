import React, { useState } from 'react';
import logo from "../../assets/logo.png";
import './style.css';
import API from "../../utils/API";
import AutocompleteTags from '../../components/AutocompleteTags';
import Navigation from "../../components/Navbar/index.jsx";
import { Button } from "react-bootstrap";

const bgColors = {
    "default": "white",
    "error": "#ffcccc",
};

const ClassCreation = ({ currentUser, history }) => {
    /* Function to move forward to Add Staff page */
    const redirectAddStaff = (id) => {
        history.push("/course/" + id + "/staff");
    }

    /* Function to redirect to Home */
    const redirectHome = () => {
        history.push("/")
    }

    /* Check if input form is valid */
    const [titleValid, setTitleValid] = useState(false);
    const [descValid, setDescValid] = useState(false);

    /* Update state of selected tags */
    const [selectedTags, setSelectedTags] = useState([]);

    const onChangeSetTags = (tagState) => {
        setSelectedTags(tagState);
    };

    /* Main function for handling class creation */
    const handleClassCreation = async (event) => {
        event.preventDefault();
        if (titleValid && descValid) {
            const { title, description, term } = event.target.elements;
            const tags = selectedTags.tags;

            /* try to create a course in database */
            try {
                // TODO: use API to create course
                const courseId = (await API.createCourse(title.value, term.value, description.value)).data;
                redirectAddStaff(courseId); // might need to change depending on how backend implements the return value
            } catch (error) {
                alert(error);
                console.error(error);
            }
        } else {
            if (!titleValid) { alert("Please enter a course title"); }
            else if (!descValid) { alert("Please enter a course description"); }
        }
    }

    /* Makes possible title input background color change  */
    const [titleBgColor, setTitleBgColor] = useState(
        bgColors.default
    );

    /* Makes sure title has the correct format */
    const handleTitleChange = (event) => {

        // Checking for format of the name
        const titleInput = event.target.value;
        let inputArr = titleInput.split(' - ');
        let courseCodeValid;
        let courseNameValid;
        if (inputArr.length > 1) {
            courseCodeValid = inputArr[0].length > 0;
            courseNameValid = inputArr[1].length > 0;
        }

        // If invalid, indicate an error
        if (titleInput === "" || !courseCodeValid || !courseNameValid) {
            setTitleBgColor(bgColors.error);
            setTitleValid(false);
        }

        // If valid, indicate valid
        else {
            setTitleBgColor(bgColors.default);
            setTitleValid(true);
        }

    }

    /* Makes possible description input background color change  */
    const [descBgColor, setDescBgColor] = useState(
        bgColors.default
    );

    /* Makes sure description has the correct format */
    const handleDescChange = (event) => {

        // Checking for format of the name
        const descInput = event.target.value;

        // If invalid, indicate an error
        if (descInput === "") {
            setDescBgColor(bgColors.error);
            setDescValid(false);
        }

        // If valid, indicate valid
        else {
            setDescBgColor(bgColors.default);
            setDescValid(true);
        }

    }

    return (
        <div>
            <Navigation currentUser={currentUser} />
            <div className="container">
                <div className="container-title">
                    <h1>Create a Class</h1>
                </div>
                <div className="input">
                    {/* Main class creation form */}
                    <form onSubmit={handleClassCreation}>
                        <div className="flex-row">
                            <p>Course Title:</p>
                            <input name="title" placeholder="Ex: CSE 111 - History of LeetCode" onBlur={handleTitleChange} style={{ backgroundColor: titleBgColor }} />
                        </div>
                        <div className="flex-row">
                            <p>Description:</p>
                            <textarea name="description" placeholder="Description" onBlur={handleDescChange} style={{ backgroundColor: descBgColor }}></textarea>
                        </div>
                        <div className="flex-row">
                            <p>Course Term:</p>
                            <select name="term">
                                <option value="SS1">Summer Session I</option>
                                <option value="SS2">Summer Session II</option>
                                <option value="FA20">Fall 2020</option>
                            </select>
                        </div>
                        <div className="flex-row">
                            <p>Initial Tags (Optional):</p>
                            <AutocompleteTags onChange={onChangeSetTags} />
                        </div>
                        <Button id="next-button" type="submit">Next Step: Adding Instructors</Button>
                    </form>
                </div>
                {/* Cancel creating a class */}
                <div className="input">
                    <Button id="cancel-button" onClick={redirectHome}>Cancel</Button>
                </div>
            </div>

        </div>
    );
};

export default ClassCreation;