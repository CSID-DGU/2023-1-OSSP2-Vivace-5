export interface Project {
    id: string;
    title: string;
    description: string;
    type: string;
    encodedImg: string;
    createdAt: string;
    userToProjects: {
        id: string;
        right: string;
        projectId: string;
        userId: string;
    }[];
    tasks: {
        milestone: boolean;
        start: string;
        end: string | null | undefined;
        deadline: string;
        isFinished: boolean;
        parentColumnId: string | undefined;
        projectId: string;
        predecessors: Task[] | undefined;
        successors: Task[] | undefined;
        parent:
            | {
                  id: string;
                  title: string;
                  description: string;
                  type: string;
                  milestone: boolean;
                  createdAt: string;
                  start: string;
                  end: string | null;
                  deadline: string;
                  isFinished: boolean;
                  parentColumnId: string | null;
                  projectId: string;
              }
            | undefined;
        children:
            | {
                  id: string;
                  title: string;
                  description: string;
                  type: string;
                  milestone: boolean;
                  createdAt: string;
                  start: string;
                  end: string | null;
                  deadline: string;
                  isFinished: boolean;
                  parentColumnId: string | null;
                  projectId: string;
                  predecessors: Task[];
                  successors: Task[];
              }[]
            | undefined;
        id: string;
        title: string;
        description: string;
        type: string;
        status: string;
        priority: string;
        startDate: string;
        endDate: string;
        createdAt: string;
        modifiedAt: string;
        userToTasks: {
            right: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                encodedImg: string;
            };
        }[];
        comments: {
            id: string;
            createdAt: string;
            modifiedAt: string;
            content: string;
            pinned: boolean;
            projectId: string;
        }[];
    }[];
    comments: {
        id: string;
        createdAt: string;
        modifiedAt: string;
        content: string;
        pinned: boolean;
        projectId: string;
    }[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    type: string;
    milestone: boolean;
    createdAt: string;
    start: string;
    end?: string | null;
    deadline: string;
    isFinished: boolean;
    parentColumnId?: string;
    projectId: string;
    predecessors?: Task[];
    successors?: Task[];
    project: {
        id: string;
        title: string;
        description: string;
        type: string;
        encodedImg: string;
        createdAt: string;
        userToProjects: {
            id: string;
            right: string;
            projectId: string;
            userId: string;
        }[];
    };

    parent?: {
        id: string;
        title: string;
        description: string;
        type: string;
        milestone: boolean;
        createdAt: string;
        start: string;
        end: string | null;
        deadline: string;
        isFinished: boolean;
        parentColumnId: string | null;
        projectId: string;
    };
    children?: {
        id: string;
        title: string;
        description: string;
        type: string;
        milestone: boolean;
        createdAt: string;
        start: string;
        end: string | null;
        deadline: string;
        isFinished: boolean;
        parentColumnId: string | null;
        projectId: string;
        predecessors: Task[];
        successors: Task[];
    }[];
}
