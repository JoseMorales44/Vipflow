import { Tables } from "./database";

export type Task = Tables<'tasks'>;

export type Column = Tables<'kanban_columns'> & {
  tasks?: Task[];
};
