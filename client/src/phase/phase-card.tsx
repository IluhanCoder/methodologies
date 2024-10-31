import { useEffect, useState } from "react";
import Phase from "./phase-type";
import Task, { TaskResponse } from "../task/task-types";
import taskService from "../task/task-service";
import TasksMapper from "../task/tasks-mapper";
import LoadingScreen from "../misc/loading-screen";
import { redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewTaskForm from "../task/new-task-form";
import PhaseTasksMapper from "../task/phase-tasks-mapper";
import AssignForm from "../task/assign-form";
import TaskInfoForm from "../task/task-info-form";
import { Rights } from "../project/project-types";
import phaseService from "./phase-service";
import AssignPhaseForm from "./assignChargeForm";

interface LocalParams {
    phase: Phase,
    rights: Rights,
    isActive?: boolean,
    callBack?: () => Promise<void>
}

const PhaseCard = ({phase, rights, callBack, isActive = true}: LocalParams) => {
    const [tasks, setTasks] = useState<TaskResponse[]>();

    const getTasks = async () => {
        const result = await taskService.getPhaseTasks(phase._id);
        setTasks([...result.tasks]);
    }

    const handleNewTask = () => {
        formStore.setForm(<NewTaskForm phaseId={phase._id} callBack={() => { getTasks(); if(callBack) callBack(); }}/>);
    }

    const handleAssign = (task: TaskResponse) => {
        formStore.setForm(<AssignForm task={task} projectId={phase.projectId} callBack={getTasks}/>)
    }

    const handleDelete = async (taskId: string) => {
        await taskService.deleteTask(taskId);
        getTasks();
        if(callBack) callBack();
    }

    const detailsHandler = (taskId: string) => {
        formStore.setForm(<TaskInfoForm taskId={taskId} callBack={getTasks} projectId={phase.projectId} rights={rights}/>)
    }

    const handleDeletePhase = async () => {
        await phaseService.deletePhase(phase._id);
        if(callBack) callBack();
    }

    const handleUp = async () => {
        await phaseService.moveUp(phase._id);
        if(callBack) await callBack();
    }

    const handleDown = async () => {
        await phaseService.moveDown(phase._id);
        if(callBack) await callBack();
    }

    const handleAssignCharge = async () => {
        formStore.setForm(<AssignPhaseForm phase={phase} callBack={getTasks}/>)
    }

    useEffect(() => {
        getTasks();
    }, [phase]);

    return <div>
        <div>
            <button type="button" className={submitButtonStyle} onClick={handleAssignCharge}>назначити відповідального</button>
        </div>
        {phase.charge && <div>
            <label>Відповідальний за етап:</label>
            <div>{phase.charge.nickname}</div>
        </div>}
        <div>
            <button type="button" onClick={handleUp} className={submitButtonStyle}>up</button>
        </div>
        <div>
            <button type="button" onClick={handleDown} className={submitButtonStyle}>down</button>
        </div>
        <div>
            <button type="button" className={redButtonSyle} onClick={handleDeletePhase}>видалити</button>
        </div>
        <div>{phase.name}</div>
        <div>
            {tasks && <PhaseTasksMapper isActive={isActive} callBack={async () => { await getTasks(); if(callBack) await callBack(); }} rights={rights} tasks={tasks} detailsHandler={detailsHandler} assignHandler={handleAssign} deleteHandler={handleDelete}/>
            || <LoadingScreen/>}
        </div>
        <div>
            <button type="button" className={submitButtonStyle} onClick={handleNewTask}>
                додати завдання
            </button>
        </div>
    </div>
}

export default PhaseCard;