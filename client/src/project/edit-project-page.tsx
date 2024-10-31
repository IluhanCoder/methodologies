import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectCredentials } from "./project-types";
import projectService from "./project-service";
import LoadingScreen from "../misc/loading-screen";
import DatePicker from "../analytics/date-picker";
import { submitButtonStyle } from "../styles/button-syles";

const EditProjectPage = () => {
    const {projectId} = useParams();
    const [formData, setFormData] = useState<ProjectCredentials>();

    const getProjectData = async () => {
        if(!projectId) return;
        const result = await projectService.getProjectById(projectId);
        setFormData({...result.project});
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(formData) 
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
    };  

    const handleStart = (date: Date) => {
        if(formData) {
            if(date >= formData.endDate) return;
            const newData: ProjectCredentials = {
                ...formData,
                startDate: date
            };
            setFormData({...newData});
        }
    }

    const handleEnd = (date: Date) => {
        if(formData) {
            if(date <= formData.startDate) return;
            const newData: ProjectCredentials = {
               ...formData,
               endDate: date
            };
            setFormData({...newData});
        }
    }

    const handleSubmit = async () => {
        if(!projectId || !formData) return;
        await projectService.editProject(projectId, formData);
        window.location.reload();
    }

    useEffect(() => { 
        getProjectData(); 
    } , []);

    if(formData) return <div>
        <div>
            <label>назва проекту:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}/>
        </div>
        <div>
            <label>днів на тиждень:</label>
            <input type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange}/>
        </div>
        <div>
            <label>годин на добу:</label>
            <input type="number" name="hoursPerDay" value={formData.hoursPerDay} onChange={handleChange}/>
        </div>
        <DatePicker startDate={formData.startDate} endDate={formData.endDate} handleStart={handleStart} handleEnd={handleEnd}/>
        <button className={submitButtonStyle} onClick={handleSubmit}>підтвердити зміни</button>
    </div>
    else return <LoadingScreen/>
}

export default EditProjectPage;