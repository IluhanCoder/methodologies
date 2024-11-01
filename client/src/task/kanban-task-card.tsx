import { VscTriangleLeft, VscTriangleRight } from "react-icons/vsc";
import Task, { TaskResponse } from "./task-types";
import { Rights } from "../project/project-types";
import SubTasksMapper from "./sub-tasks-mapper";
import { submitButtonStyle } from "../styles/button-syles";
import formStore from "../forms/form-store";
import NewSubTaskForm from "./new-subtask-form";
import { useEffect, useState } from "react";
import taskService from "./task-service";

interface LocalParams {
    task: TaskResponse,
    handleMove: (taskId: string, statusIndex: number) => Promise<void>,
    handleTaskClick: (taskId: string) => void,
    currentUserIsExecutorOrOwner: (task: TaskResponse) => boolean,
    rights: Rights,
    callBack?: () => {}
}

const KanBanTaskCard = ({task, rights, handleMove, handleTaskClick, currentUserIsExecutorOrOwner, callBack}: LocalParams) => {
    const [allSubTasksDone, setAllSubTasksDone] = useState<boolean>(true);

    const checkSubTasks = async () => {
        const result = await taskService.allSubTasksAreDone(task._id);
        console.log(result);
        setAllSubTasksDone(result.areDone);
    }

    const handleNewSubTask = () => {
        formStore.setForm(<NewSubTaskForm parentTaskId={task._id} callBack={callBack}/>)
    }

    useEffect(() => {
        checkSubTasks();
    }, [callBack])

    return <div className="grid grid-cols-6 bg-white rounded py-2 px-4 border">
                {(task.status === "done" || task.status === "inProgress") && (currentUserIsExecutorOrOwner(task) || rights?.check) && <div className="flex flex-col justify-center">
                        <button onClick={() => handleMove(task._id, task.status === "inProgress" ? 0 : 1)} className="mt-1"><VscTriangleLeft className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                    </div>}

                
                <div className="flex col-span-4 flex-col gap-2 py-1 col-start-2">
                    <button className="text-3xl" type="button" onClick={() => handleTaskClick(task._id)}>{task.name}</button>
                    <div className="flex flex-col gap-4 py-1">
                        {<SubTasksMapper rights={rights} disableCheckboxes={task.status === "done"} taskId={task._id} callBack={callBack}/>}
                        {task.status !== "done" && rights.create && <div className="flex justify-center">
                            <button type="button" className={submitButtonStyle + " text-xs px-5"} onClick={handleNewSubTask}>додати підзадачу</button>
                        </div>}
                    </div>
                </div>

                {((task.status === "toDo" || allSubTasksDone && task.status === "inProgress") && (currentUserIsExecutorOrOwner(task) || rights?.check)) && <div className="flex justify-end">
                    <button onClick={() => handleMove(task._id, task.status === "toDo" ? 1 : 2)} className="mt-1"><VscTriangleRight className="bg-blue-600 p-1 rounded text-white text-2xl"/></button>
                </div>}
                
        </div>
}

export default KanBanTaskCard;