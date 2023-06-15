import { SubTask } from "../Enum/SubTask.enum";
import { TaskInfoType } from "./TaskInfo.type";

export type BriefTaskInfoType = {
  id: string;
  title: string;
  description: string;
  type: SubTask;
  milestone: boolean;
  isFinished: boolean;
  isBookmarked: boolean;
  rate: number;
  predecessors: TaskInfoType[];
  successors: TaskInfoType[];
};
