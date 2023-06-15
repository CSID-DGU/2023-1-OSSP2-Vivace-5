import { Right } from "../Enum/Right.enum";
import { SubTask } from "../Enum/SubTask.enum";

export type BriefProjectInfoType = {
  id: string;
  title: string;
  description: string;
  type: SubTask;
  isBookmarked: boolean;
  encodedImg: string;
  right: Right;
  progress: number;
};
