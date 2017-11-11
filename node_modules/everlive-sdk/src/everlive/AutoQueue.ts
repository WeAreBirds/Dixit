import * as _ from 'underscore';

import { EverliveError } from './EverliveError';
import { Constants } from './constants';

export interface task {
    task: Function,
    args: any[],
    success: Function,
    error: Function
}

export class AutoQueue {
    public maxConcurrentTasks: number;
    public runningTasksCount;
    public tasks: task[];

    constructor(maxConcurrentTasks: number|string) {
        var tasksNumber = maxConcurrentTasks || Constants.MaxConcurrentDownloadTasks;
        this.maxConcurrentTasks = parseInt(tasksNumber + '', 10);

        if (_.isNaN(this.maxConcurrentTasks) || maxConcurrentTasks <= 0) {
            throw new EverliveError({message: 'The maxConcurrentTasks must be a number larger than 0'});
        }

        this.runningTasksCount = 0;
        this.tasks = [];
    }

    /**
     * @param {Function} task
     * @param {Function} taskSuccess
     * @param {Function} taskError
     */
    public enqueue(task: Function, taskSuccess: Function, taskError: Function): void {
        this.tasks.push({
            task: task,
            args: [].splice.call(arguments, 3),
            success: taskSuccess,
            error: taskError
        });

        this.runNext();
    }

    private runNext(): void {
        var self = this;

        if (self.runningTasksCount === self.maxConcurrentTasks || !self.tasks.length) {
            return;
        }

        self.runningTasksCount++;

        var nextTask = this.tasks.shift();
        var task = nextTask.task;
        var args = nextTask.args;
        var taskSuccess = nextTask.success;
        var taskError = nextTask.error;

        args.unshift(function executedCallback(err) {
            self.runningTasksCount--;

            if (err) {
                taskError(err);
            } else {
                taskSuccess.apply(null, [].splice.call(arguments, 1));
            }

            self.runNext();
        });

        task.apply(null, args);
    }
}
