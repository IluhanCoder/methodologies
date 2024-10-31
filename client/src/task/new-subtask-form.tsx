import { useState } from "react";
import FormComponent from "../forms/form-component";
import { inputStyle } from "../styles/form-styles";
import taskService from "./task-service";
import formStore from "../forms/form-store";
import { submitButtonStyle } from "../styles/button-syles";

interface LocalParams {
    parentTaskId: string,
    callBack?: () => {}
}

const NewSubTaskForm = ({parentTaskId, callBack}: LocalParams) => {
    const [name, setName] = useState<string>("");

    const handleSubmit = async () => {
        await taskService.createSubTask(parentTaskId, name);
        if(callBack) callBack();
        formStore.dropForm();
    }

    return <FormComponent formLabel="створення підзадачі">
        <div>
            <input type="text" className={inputStyle} value={name} onChange={(event) => setName(event.target.value)}/>
            <button type="button" className={submitButtonStyle} onClick={handleSubmit}>
                створити
            </button>
        </div>
    </FormComponent>
}

export default NewSubTaskForm;