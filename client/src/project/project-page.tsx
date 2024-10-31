import { useNavigate, useParams } from "react-router-dom";
import projectService from "./project-service";
import { ChangeEvent, useEffect, useState } from "react";
import { ExtendedProjectResponse, ParticipantResponse, ProjectResponse, Rights } from "./project-types";
import { grayButtonStyle, redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import InviteForm from "../invite/invite-form";
import inviteService from "../invite/invite-service";
import { UserResponse } from "../user/user-types";
import userStore from "../user/user-store";
import { observer } from "mobx-react";
import BacklogTasksTile from "../task/tasks-mapper";
import NewTaskForm from "../task/new-task-form";
import NewBacklogForm from "../backlogs/new-backlog-form";
import BacklogSprintsMapper from "../sprint/backlog-sprints-mapper";
import BacklogMapper from "../backlogs/backlogs-mapper";
import taskService from "../task/task-service";
import NewOwnerForm from "./new-owner-form";
import Avatar from "react-avatar";
import { convertImage } from "./participants-window";
import LoadingScreen from "../misc/loading-screen";
import { Link } from "react-router-dom";
import { VscGraphLine, VscOrganization, VscTable, VscSettingsGear } from "react-icons/vsc";
import Scrum from "../task/scrum";
import KanBan from "../task/kanban";
import Waterfall from "../task/waterfall";
import PriceWindow from "./price-window";
import RequiremenetsWindow from "../requirements/requirements-window";

function ProjectPage () {
    const [project, setProject] = useState<ExtendedProjectResponse | null>(null);
    const [rights, setRights] = useState<Rights>();

    //todo: додати в kanban кнопку "створити задачу"

    const navigate = useNavigate();

    const {projectId} = useParams();

    const getUserRights = () => {
        if(project?.owner._id === userStore.user?._id) {
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
        const currentUser = project?.participants.find((participant: ParticipantResponse) => 
            participant.participant._id === userStore.user?._id);
        const userRights = currentUser?.rights;
        setRights(userRights);
    }

    const getProjectData = async () => {
        if(!projectId) return;
        const result = await projectService.getProjectById(projectId);
        console.log(result);
        setProject({...result.project});
    }

    const handleAddUser = async () => {
        if(project)
            await formStore.setForm(<InviteForm project={project} callBack={getProjectData}/>);
    }

    const handleLeave = async () => {
        if(project) {
            await projectService.leaveProject(project?._id);
            navigate("/");
        }
    }

    const handleDeleteParticipant = async(participantId: string) => {
        if(project) {
            await projectService.deleteParticipant(project?._id, participantId);
            getProjectData();
        }
    }

    const handleCancelInvite = async(guestId: string) => {
        if(project) {
            await inviteService.deleteInvite(guestId, project?._id);
            getProjectData();
        }
    }

    const handleChangeOwner = () => {
        if(project) {
            formStore.setForm(<NewOwnerForm project={project} callBack={getProjectData}/>);
        }
    }

    const handleProjectDelete = async () => {
        if(projectId) {
            await projectService.deleteProject(projectId);
            navigate("/projects");
        }
    }

    const handleCreateBacklog = () => {
        if(project) {
            formStore.setForm(<NewBacklogForm projectId={project._id} callBack={getProjectData}/>)
        }
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm projectId={project?._id} callBack={getProjectData}/>)
    }

    useEffect(() => {
        getProjectData();
    }, [projectId])

    useEffect(() => {
        getUserRights();
    }, [project]);

    if(project) return <div>
        {project && <div className="flex flex-col">
        <div className="flex justify-center p-4">
                        <div className="grow text-center text-3xl">{project?.name}</div>
                        <div className="flex gap-2">{project.owner._id === userStore.user?._id && <div>
                        <button className={redButtonSyle + " text-xs mt-1"} type="button" onClick={handleChangeOwner}>змінити власника проекту</button>
                    </div>}
                    {project?.owner._id === userStore.user?._id && 
                    <button type="button" className={redButtonSyle + " text-xs mt-1"} onClick={handleProjectDelete}>
                        видалити проект
                    </button> || 
                    <button type="button" className={redButtonSyle + " text-xs mt-1"} onClick={handleLeave}>
                        покинути проект
                    </button>}</div>
                    </div>
            <div className="flex ">
            
            {rights && project.type === "scrum" && <div className="flex flex-col grow px-6 py-2">
                <Scrum project={project} rights={rights} onCreate={handleCreateBacklog}/>
            </div>}

            {rights && project.type === "kanban" && <div>
                <KanBan callBack={getProjectData} project={project} rights={rights}/>
            </div>}

            {rights && project.type === "waterfall" && <div>
                <Waterfall rights={rights} project={project}/>
            </div>}

            <div>
                <button type="button" className={submitButtonStyle} onClick={handleNewTask}>
                    додати задачу
                </button>
            </div>
        
            <div className="p-4 flex flex-col gap-4">
                <div className="flex w-full">
                    <Link to={`/analytics/${project._id}`} className="flex gap-2 py-1 px-2 bg-gray-100 text-gray-600 font-semibold rounded w-full justify-center">
                        <VscGraphLine strokeWidth={1.25} className="mt-1.5"/>
                        <div>аналітика проєкту</div>
                    </Link>
                </div>
                {rights?.editParticipants && <div className="flex w-full">
                    <Link to={`/rights/${project._id}`} className="flex gap-2 py-1 px-2 bg-gray-100 text-gray-600 font-semibold rounded w-full justify-center">
                        <VscOrganization size={24} strokeWidth={0.4} className="mt-0.5"/>
                        <div>права учасників</div>
                    </Link>
                </div>}
                {rights?.editProjectData && <div className="flex w-full">
                    <Link to={`/settings/${project._id}`} className="flex gap-2 py-1 px-2 bg-gray-100 text-gray-600 font-semibold rounded w-full justify-center">
                        <VscSettingsGear size={24} strokeWidth={0.4} className="mt-0.5"/>
                        <div>налаштування проєкту</div>
                    </Link>
                </div>}
                <div className="flex w-full">
                    <button onClick={() => {formStore.setForm(<RequiremenetsWindow projectId={projectId!}/>)}} className="flex gap-2 py-1 px-2 bg-gray-100 text-gray-600 font-semibold rounded w-full justify-center">
                        <VscSettingsGear size={24} strokeWidth={0.4} className="mt-0.5"/>
                        <div>вимоги проєкту</div>
                    </button>
                </div>
                <div className="flex flex-col gb-gray-50 border">
                    <div className="text-center text-gray-600 font-bold pt-2">
                        Власник проекту:
                    </div>
                    <div className="flex flex-col px-6 py-4 justify-center gap-2">
                        <div className="flex gap-4 justify-center">
                            <div className="">
                                <Avatar round size="40" name={project.owner.nickname} src={(project.owner.avatar) ? convertImage(project.owner.avatar) : ""}/>
                            </div>
                            <div className="text-2xl pt-1">
                                {project.owner.nickname}
                            </div>
                        </div>
                        <div className="flex gap-2 font-regular justify-center">
                            <div>
                                {project.owner.name}
                            </div>
                            <div>
                                {project.owner.surname}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gb-gray-50 border">
                    <div className="text-center text-gray-600 font-bold pt-2">
                        Учасники:
                    </div>
                    <div className="flex ">
                        <div className="grow flex gap-2 py-3 px-6 flex-col">{project.participants.map((participant: ParticipantResponse) => {
                            if(participant.participant && participant.participant._id) return <div className="flex border border-2 rounded p-4 justify-between gap-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Avatar round size="30" name={participant.participant.nickname} src={convertImage((participant.participant.avatar) ? participant.participant.avatar : "")}/>
                                        <div className="text-xl">{participant.participant.nickname}</div>
                                    </div>
                                    <div className="flex gap-2 pl-3">
                                        <div className="text-sm font-regular">{participant.participant.name}</div>
                                        <div className="text-sm font-regular">{participant.participant.surname}</div>
                                    </div>
                                </div>
                                {rights?.editParticipants && 
                                <div className="flex flex-col justify-center">
                                    <button type="button" className={redButtonSyle + " text-xs"} 
                                        onClick={() => handleDeleteParticipant(participant.participant._id)}>
                                        видалити
                                    </button>
                                </div>}
                            </div>
                        })}</div>
                    </div>
                    <div>
                    {rights?.addParticipants && <div className="flex justify-center px-2 pb-4"><button type="button" className={grayButtonStyle + " text-xs"} onClick={handleAddUser}>
                        додати учасника
                    </button></div>}
                    </div>
                </div>
                <div className="flex flex-col gb-gray-50 border">
                    <PriceWindow projectId={project._id}/>
                </div>
                {project.invited.length > 0 && <div className="flex flex-col gb-gray-50 border">
                        <div className="text-center text-gray-600 pt-2">
                            Запрошені користувачі:
                        </div>
                        <div className="flex ">
                        <div className="grow flex gap-2 py-3 px-6 flex-col">{project?.invited.map((user: UserResponse) => <div className="flex border border-2 rounded p-4 justify-between gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Avatar round size="30" name={user.nickname} src={convertImage((user.avatar) ? user.avatar : "")}/>
                                    <div className="text-xl">{user.nickname}</div>
                                </div>
                                <div className="flex gap-2 pl-3">
                                    <div className="text-sm font-regular">{user.name}</div>
                                    <div className="text-sm font-regular">{user.surname}</div>
                                </div>
                            </div>
                            {rights?.editParticipants && <div className="flex flex-col justify-center">
                                <button type="button" className={redButtonSyle + " text-xs"}  onClick={() => handleCancelInvite(user._id)}>скасувати</button>
                            </div>}
                        </div>)}</div></div>
                    </div>}
            </div>
        </div></div>}
        
    </div>
    else return <LoadingScreen/>
}

export default observer(ProjectPage);