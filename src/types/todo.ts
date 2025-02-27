export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
}
