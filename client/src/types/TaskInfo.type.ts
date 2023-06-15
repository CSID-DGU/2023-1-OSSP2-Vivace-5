import { SubTask } from "../Enum/SubTask.enum";

export type TaskInfoType = {
  id: string;
  title: string;
  description: string;
  type: SubTask;
  milestone: boolean;
  createdAt: Date;
  start: Date;
  end: Date | null;
  deadline: Date;
  isFinished: boolean;
  parentColumnId: string | null;
  projectId: string;
};
