import FormComponent from "../forms/form-component";
import RequirementsMapper from "./requirements-mapper";

interface LocalParams {
    projectId: string
}

const RequiremenetsWindow = ({projectId}: LocalParams) => {
    return <FormComponent formLabel="вимоги до проєкту">
        <RequirementsMapper projectId={projectId}/>
    </FormComponent>
}

export default RequiremenetsWindow;