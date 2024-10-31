import Task, { SubTask, TaskCredentials, TaskResponse, UpdateTaskCredentials } from "./task-types";
import mongoose from "mongoose";
import TaskModel, { SubTaskModel } from "./task-model";
import backlogModel from "../backlog/backlog-model";
import TaskStatuses, { TaskDifficulties, TaskPriorities } from "./task-statuses";
import ProjectModel from "../projects/project-model";
import projectService from "../projects/project-service";
import journalService from "../auth/journal-service";

export default new class TaskService {
    async addTask(newTask: TaskCredentials) {
        try {
            const task: Task = {
                projectId: newTask.projectId ? new mongoose.Types.ObjectId(newTask.projectId) : null,
                backlogId: newTask.backlogId ? new mongoose.Types.ObjectId(newTask.backlogId) : null,
                sprintId: newTask.sprintId ? new mongoose.Types.ObjectId(newTask.sprintId) : null,
                phaseId: newTask.phaseId ? new mongoose.Types.ObjectId(newTask.phaseId) : null,
                name: newTask.name,
                desc: newTask.desc,
                isChecked: false,
                createdBy: new mongoose.Types.ObjectId(newTask.createdBy),
                created: new Date(),
                checkedDate: undefined,
                executors: newTask.executors ?? [],
                status: TaskStatuses[0],
                difficulty: TaskDifficulties[1],
                priority: TaskPriorities[1],
                requirements: newTask.requirements
            };
            await TaskModel.create(task);
        } catch (error) {
            throw error;
        }
    }

    async getProjectTasks(projectId: string) {
        try {
          const result = await TaskModel.aggregate([
            // Step 1: Match tasks by the specified projectId
            {
              $match: { projectId: new mongoose.Types.ObjectId(projectId) }
            },
            // Step 2: Lookup executors details from the User collection
            {
              $lookup: {
                from: 'users', // Assuming 'users' is your User collection name
                localField: 'executors',
                foreignField: '_id',
                as: 'executorDetails'
              }
            },
            // Step 3: Format tasks to match TaskResponse
            {
              $project: {
                name: 1,
                desc: 1,
                backlogId: 1,
                projectId: 1,
                sprintId: 1,
                isChecked: 1,
                createdBy: 1,
                created: 1,
                checkedDate: 1,
                status: 1,
                difficulty: 1,
                priority: 1,
                requirements: 1,
                executors: {
                  $map: {
                    input: '$executorDetails',
                    as: 'executor',
                    in: {
                      _id: '$$executor._id',
                      name: '$$executor.name',
                      surname: '$$executor.surname',
                      nickname: '$$executor.nickname',
                      email: '$$executor.email',
                      organisation: '$$executor.organisation',
                      avatar: '$$executor.avatar'
                    }
                  }
                }
              }
            }
          ]);
          return result;
        } catch (error) {
            throw error;
        }
    }

    async getPhaseTasks(phaseId: string) : Promise<TaskResponse[]> {
      const result = await TaskModel.aggregate([
        // Step 1: Match tasks by the specified projectId
        {
          $match: { phaseId: new mongoose.Types.ObjectId(phaseId) }
        },
        // Step 2: Lookup executors details from the User collection
        {
          $lookup: {
            from: 'users', // Assuming 'users' is your User collection name
            localField: 'executors',
            foreignField: '_id',
            as: 'executorDetails'
          }
        },
        // Step 3: Format tasks to match TaskResponse
        {
          $project: {
            name: 1,
            desc: 1,
            backlogId: 1,
            projectId: 1,
            sprintId: 1,
            isChecked: 1,
            createdBy: 1,
            created: 1,
            checkedDate: 1,
            status: 1,
            difficulty: 1,
            priority: 1,
            requirements: 1,
            executors: {
              $map: {
                input: '$executorDetails',
                as: 'executor',
                in: {
                  _id: '$$executor._id',
                  name: '$$executor.name',
                  surname: '$$executor.surname',
                  nickname: '$$executor.nickname',
                  email: '$$executor.email',
                  organisation: '$$executor.organisation',
                  avatar: '$$executor.avatar'
                }
              }
            }
          }
        }
      ]);
      return result;
    }

    async checkTask (taskId: string, userId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, { isChecked: true });
      } catch (error) {
        throw error;
      }
    }

    async unCheckTask (taskId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, { isChecked: false });
      } catch (error) {
        throw error;
      }
    }

    async setStatus (taskId: string, index: number) {
      try {
        const query = {
          checkedDate: (index === 2) ? new Date() : null,
          status: TaskStatuses[index]
        }
        await TaskModel.findByIdAndUpdate(taskId, query);
      } catch (error) {
        throw error;
      }
    }

    async assignTask (taskId: string, userId: string) {
      try {
        await TaskModel.findByIdAndUpdate(taskId, {$push: {executors: userId}});
      } catch (error) {
        throw error;
      }
    }

    async getAllTasks(projectId: string) {
      const result = await backlogModel.aggregate([
          {
            $match: {
              projectId: new mongoose.Types.ObjectId(projectId),
            },
          },
          {
            $lookup: {
              from: 'sprints',
              localField: 'sprints',
              foreignField: '_id',
              as: 'sprintData',
            },
          },
          {
            $project: {
              tasks: {
                $concatArrays: ['$tasks', { $ifNull: ['$sprintData.tasks', []] }],
              },
            },
          },
          {
            $unwind: {
              path: '$tasks',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'tasks',
              localField: 'tasks',
              foreignField: '_id',
              as: 'taskData',
            },
          },
          {
            $unwind: {
              path: '$taskData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'taskData.executors',
              foreignField: '_id',
              as: 'executorsData',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'taskData.createdBy',
              foreignField: '_id',
              as: 'createdByData',
            },
          },
          {
            $group: {
              _id: null,
              tasks: {
                $push: {
                  _id: '$taskData._id',
                  name: '$taskData.name',
                  desc: '$taskData.desc',
                  projectId: '$taskData.projectId',
                  isChecked: '$taskData.isChecked',
                  created: '$taskData.created',
                  checkedDate: '$taskData.checkedDate',
                  executors: '$executorsData',
                  createdBy: '$createdByData',
                  status: "$taskData.status"
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              tasks: 1,
            },
          },
        ]);
      return result[0].tasks;
  }

  async deleteTask(taskId: string) {
    const convertedTaskId = new mongoose.Types.ObjectId(taskId);
    await TaskModel.findByIdAndDelete(taskId);
    SubTaskModel.deleteMany({parentTask: convertedTaskId});
  }

  async getTaskById(taskId: string) {
    const result = await TaskModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "executors",
          foreignField: "_id",
          as: "executorsData"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          desc: 1,
          requirements: 1,
          priority: 1,
          status: 1,
          difficulty: 1,
          created: 1,
          checkedDate: 1,
          // Other fields you want to include from the task
          executors: {
            $map: {
              input: "$executorsData",
              as: "executor",
              in: {
                _id: "$$executor._id",
                nickname: "$$executor.nickname",
                // Other fields you want to include from the user
              }
            }
          }
        }
      }
    ])
    return result[0];
  }

  async updateTask(taskId: string, newData: UpdateTaskCredentials, userId: string) {
    if(newData.status === "done") { 
      newData.checkedDate = new Date();
      await journalService.doneTask(userId);
    }
    else newData.checkedDate = null;
    await TaskModel.findByIdAndUpdate(taskId, newData);
  }

  async createSubTask(parentTaskId: string, name: string) {
    const convertedTaskId = new mongoose.Types.ObjectId(parentTaskId);
    await SubTaskModel.create({parentTask: convertedTaskId, name, isChecked: false});
  }

  async checkSubTask(subTaskId: string) {
    const oldCheck: boolean = (await SubTaskModel.findById(subTaskId)).isChecked;
    await SubTaskModel.findByIdAndUpdate(subTaskId, {isChecked: !oldCheck});
  }

  async getSubTasks(parentTaskId: string): Promise<SubTask[] | null> {
    const convertedTaskId = new mongoose.Types.ObjectId(parentTaskId);
    const result: SubTask[] = await SubTaskModel.find({parentTask: convertedTaskId});
    return result.length > 0 ? result : null;
  }

  async allSubTasksAreDone(taskId: string): Promise<boolean> {
    const subTasks: SubTask[] | null = await this.getSubTasks(taskId);
    const result = (subTasks) ? !subTasks.find((subTask: SubTask) => !subTask.isChecked) : true;
    return result;
  }

  async deleteSubTask(subTaskId: string) {
    await SubTaskModel.findByIdAndDelete(subTaskId);
  }
}
