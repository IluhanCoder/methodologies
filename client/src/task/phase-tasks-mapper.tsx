import { useEffect, useState } from "react";
import { TaskResponse } from "./task-types";
import taskService from "./task-service";
import TasksMapper from "./tasks-mapper";
import formStore from "../forms/form-store";
import AssignForm from "./assign-form";
import { UserResponse } from "../user/user-types";
import { lightButtonStyle, redButtonSyle } from "../styles/button-syles";
import TaskInfoForm from "./task-info-form";
import TaskStatusDisplayer from "./task-status-diplayer";
import { Rights } from "../project/project-types";
import TaskPriorityDisplayer from "./task-priority-displayer";

interface LocalParams {
    tasks: TaskResponse[],
    assignHandler: (task: TaskResponse) => void,
    deleteHandler: (taskId: string) => void,
    detailsHandler: (taskId: string) => void,
    callBack?: () => void,
    isActive?: boolean,
    rights: Rights
}

function PhaseTasksMapper ({tasks, callBack, assignHandler, isActive = true, deleteHandler, detailsHandler, rights}: LocalParams) {
    const handleChangeStatus = async (task: TaskResponse, newStatus: string) => {
        await taskService.updateTask(task._id, {...task, status: newStatus});
        if(callBack) callBack();
    }

    if(tasks[0] && tasks[0].name) return <div className="flex flex-col gap-1">{tasks.map((task: TaskResponse) => task.name && <div className="rounded py-2 pl-10 pr-4 gap-6 border-2 flex justify-between">
            <div className="text-xl font-bold mt-0.5">{task.name}</div>
            <div>
                <select disabled={!isActive} value={task.status} onChange={(event) => { handleChangeStatus(task, event.target.value) }}>
                    <option value="toDo">треба виконати</option>
                    <option value="inProgress">в процесі</option>
                    <option value="done">виконано</option>
                </select>
            </div>
            <div>
                <TaskPriorityDisplayer className="mt-1" priority={task.priority}/>
            </div>
            <div className="flex gap-2">
                <button type="button" className={lightButtonStyle} onClick={() => detailsHandler(task._id)}>деталі</button>
                {rights.delete && <button type="button" className={redButtonSyle} onClick={() => deleteHandler(task._id)}>видалити</button>}
            </div>
        </div>
    )}</div>
    else return <div className="flex justify-center p-8 text-xl font-bold text-gray-600">задачі відсутні</div>
}

export default PhaseTasksMapper;