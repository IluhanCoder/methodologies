import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name: String,
    desc: String,
    projectId: { 
        type: mongoose.Types.ObjectId,
        default: null
    },
    sprintId: { 
        type: mongoose.Types.ObjectId,
        default: null
    },
    backlogId: { 
        type: mongoose.Types.ObjectId,
        default: null
    },
    phaseId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    isChecked: Boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: { type: Date, required: false },
    executors: [mongoose.Types.ObjectId],
    status: String,
    difficulty: String,
    priority: String,
    requirements: String,
});

const TaskModel = mongoose.model('Task', taskSchema);

export default TaskModel;

const subTaskSchema = new mongoose.Schema({
    name: String,
    parentTask: mongoose.Types.ObjectId,
    isChecked: Boolean
})

export const SubTaskModel = mongoose.model('SubTask', subTaskSchema);