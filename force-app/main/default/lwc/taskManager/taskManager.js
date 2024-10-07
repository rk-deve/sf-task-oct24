import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskManagerController.getTasks';
import updateTaskStatus from '@salesforce/apex/TaskManagerController.updateTaskStatus';
import createTask from '@salesforce/apex/TaskManagerController.createTask';
import { refreshApex } from '@salesforce/apex';

const PRIORITY_OPTIONS = [
    { label: 'High', value: 'High' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Low', value: 'Low' }
];

export default class TaskManager extends LightningElement {
    @track tasks;
    @track columns = [
        { label: 'Subject', fieldName: 'Subject', editable: false },
        { label: 'Due Date', fieldName: 'ActivityDate', type: 'date', editable: false },
        { label: 'Status', fieldName: 'Status', type: 'text', editable: false },
        {
            label: 'Mark Complete',
            type: 'button-icon',
            typeAttributes: {
                iconName: { fieldName: 'completeIcon' },
                alternativeText: 'Mark Complete',
                title: 'Mark Complete',
                disabled: { fieldName: 'isCompleted' },
                rowId: { fieldName: 'Id' } // Include the row Id
            }
        }
    ];
    @track showNewTaskForm = false;
    newTaskSubject = '';
    newTaskDueDate = '';
    newTaskPriority = 'Normal';
    priorityOptions = PRIORITY_OPTIONS;
    wiredTasksResult;

    // Fetch tasks for current user
    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        if (result.data) {
            this.tasks = result.data.map(task => {
                return {
                    ...task,
                    isCompleted: task.Status === 'Completed',
                    completeIcon: task.Status === 'Completed' ? 'utility:check' : 'utility:add'
                };
            });
        } else if (result.error) {
            console.error('Error fetching tasks:', result.error);
        }
    }

    // Handle the 'Mark Complete' button click event
    handleRowAction(event) {
        const taskId = event.detail.row.Id;
        updateTaskStatus({ taskId: taskId, status: 'Completed' })
            .then(() => {
                // Display a toast notification
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: `${event.detail.row.Subject} task marked complete!`,
                        variant: 'success',
                    }),
                );
                return refreshApex(this.wiredTasksResult); // Refresh the task list after updating
            })
            .catch(error => {
                console.error('Error updating task status:', error);
            });
    }

    handleNewTask() {
        this.showNewTaskForm = true;
    }

    handleInputChange(event) {
        const field = event.target.label;
        if (field === 'Subject') {
            this.newTaskSubject = event.target.value;
        } else if (field === 'Due Date') {
            this.newTaskDueDate = event.target.value;
        } else if (field === 'Priority') {
            this.newTaskPriority = event.target.value;
        }
    }

    saveTask() {
        const taskDetails = {
            Subject: this.newTaskSubject,
            DueDate: this.newTaskDueDate,
            Priority: this.newTaskPriority
        };

        createTask({ taskDetails })
            .then(() => {
                this.showNewTaskForm = false;
                // Display a toast notification
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: `task created!`,
                    variant: 'success',
                }),
            );
                return refreshApex(this.wiredTasksResult); // Refresh tasks after creation
            })
            .catch(error => {
                console.error('Error creating task:', error);
            });
    }
}