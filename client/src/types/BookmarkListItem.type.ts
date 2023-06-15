export type BookmarkListItemType = {
  id: string;
  title: string;
  taskId: string | null;
  children: BookmarkListItemType[];
};
