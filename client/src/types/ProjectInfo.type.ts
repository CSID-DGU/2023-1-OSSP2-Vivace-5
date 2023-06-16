import { SubTask } from "../Enum/SubTask.enum";
import { BriefTaskInfoType } from "./BriefTaskInfo.typs";
import { BriefMemberInfoType } from "./BriefMemberInfo.type";

export type ProjectInfoType = {
  title: string;
  description: string;
  type: SubTask;
  createdAt: Date;
  encodedImg: string;
  members: BriefMemberInfoType[];
  tasks: BriefTaskInfoType[];
  comments: any[];
};
