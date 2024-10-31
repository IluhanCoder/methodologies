import { useEffect, useState } from "react";
import { SubTask } from "./task-types";
import taskService from "./task-service";
import LoadingScreen from "../misc/loading-screen";
import formStore from "../forms/form-store";
import NewSubTaskForm from "./new-subtask-form";
import { redButtonSyle, submitButtonStyle } from "../styles/button-syles";
import { Rights } from "../project/project-types";

interface LocalParams {
    taskId: string,
    disableCheckboxes?: boolean,
    rights: Rights,
    callBack?: () => {}
}

const SubTasksMapper = ({taskId, callBack, disableCheckboxes, rights}: LocalParams) => {
    const [subTasks, setSubTasks] = useState<SubTask[] | null>();

    const getSubTasks = async () => {
        const result = await taskService.getSubTasks(taskId);
        setSubTasks((result.subTasks) ? [...result.subTasks] : null);
    }

    const handleCheckSubTask = async (subTaskId: string) => {
        await taskService.checkSubTask(subTaskId);
        if(callBack) callBack();
    }

    const handleSubtaskDelete = async (subTaskId: string) => {
        await taskService.deleteSubTask(subTaskId);
        if(callBack) callBack();
    }

    useEffect(() => { getSubTasks() }, [callBack]);

    if(subTasks) return <div>
        {subTasks.map((subTask: SubTask) => {
            return <div>
                <div>
                    <input disabled={disableCheckboxes} checked={subTask.isChecked} type="checkbox" onChange={() => handleCheckSubTask(subTask._id)}/>
                </div>
                <div>{subTask.name}</div>
                {rights.delete && <div>
                    <button type="button" onClick={() => {handleSubtaskDelete(subTask._id)}} className={redButtonSyle}>X</button>
                </div>}
            </div>
        })}
    </div>
    else if(subTasks === null) return <></>
    else return <LoadingScreen/>
}

export default SubTasksMapper;