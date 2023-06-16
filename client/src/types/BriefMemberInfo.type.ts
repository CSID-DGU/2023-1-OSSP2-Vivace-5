import { Right } from "../Enum/Right.enum";

export type BriefMemberInfoType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  encodedImg: string;
  isBookmarked: boolean;
  right: Right;
};
