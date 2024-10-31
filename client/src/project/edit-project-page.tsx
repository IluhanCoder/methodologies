import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Project, { ParticipantResponse, ProjectCredentials, ProjectResponse, Rights } from "./project-types";
import projectService from "./project-service";
import LoadingScreen from "../misc/loading-screen";
import DatePicker from "../analytics/date-picker";
import { redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import userStore from "../user/user-store";
import NewOwnerForm from "./new-owner-form";
import formStore from "../forms/form-store";

const EditProjectPage = () => {
    const navigate = useNavigate();

    const {projectId} = useParams();
    const [formData, setFormData] = useState<ProjectCredentials>();
    const [projectData, setProjectData] = useState<ProjectResponse>();
    const [rights, setRights] = useState<Rights>();

    const getProjectData = async () => {
        if(!projectId) return;
        const result = await projectService.getProjectById(projectId);
        setFormData({...result.project});
        setProjectData({...result.project});
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

    const handleProjectDelete = async () => {
        if(projectId) {
            await projectService.deleteProject(projectId);
            navigate("/projects");
        }
    }

    const handleChangeOwner = () => {
        if(projectData) {
            formStore.setForm(<NewOwnerForm project={projectData} callBack={getProjectData}/>);
        }
    }

    const getUserRights = () => {
        if(projectData?.owner._id === userStore.user?._id) {
            setRights({
            create: true,
            edit: true,
            delete: true,
            check: true,
            editParticipants: true,
            addParticipants: true,
            editProjectData: true
            });
            return; }
        const currentUser = projectData?.participants.find((participant: ParticipantResponse) => 
            participant.participant._id === userStore.user?._id);
        const userRights = currentUser?.rights;
        setRights(userRights);
    }

    useEffect(() => { 
        getProjectData(); 
    } , []);

    useEffect(() => {
        getUserRights();
    }, [projectData])

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
        {rights?.editProjectData && <button type="button" className={redButtonSyle + " text-xs mt-1"} onClick={handleProjectDelete}>
            видалити проєкт
        </button>}
        {projectData?.owner._id === userStore.user?._id && <div>
                            <button className={redButtonSyle + " text-xs mt-1"} type="button" onClick={handleChangeOwner}>змінити власника проекту</button>
                        </div>}
        <button className={submitButtonStyle} onClick={handleSubmit}>підтвердити зміни</button>
    </div>
    else return <LoadingScreen/>
}

export default EditProjectPage;