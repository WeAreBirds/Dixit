export interface task {
    task: Function;
    args: any[];
    success: Function;
    error: Function;
}
export declare class AutoQueue {
    maxConcurrentTasks: number;
    runningTasksCount: any;
    tasks: task[];
    constructor(maxConcurrentTasks: number | string);
    /**
     * @param {Function} task
     * @param {Function} taskSuccess
     * @param {Function} taskError
     */
    enqueue(task: Function, taskSuccess: Function, taskError: Function): void;
    private runNext();
}
