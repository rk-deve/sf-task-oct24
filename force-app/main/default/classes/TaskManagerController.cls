public with sharing class TaskManagerController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks() {
        return [
            SELECT Id, Subject, ActivityDate, Status 
            FROM Task 
            WHERE OwnerId = :UserInfo.getUserId()
        ];
    }

    @AuraEnabled
    public static void updateTaskStatus(Id taskId, String status) {
        Task taskToUpdate = [SELECT Id, Status FROM Task WHERE Id = :taskId LIMIT 1];
        taskToUpdate.Status = status;
        update taskToUpdate;
    }

    @AuraEnabled
    public static void createTask(Map<String, Object> taskDetails) {
        Task newTask = new Task();
        newTask.Subject = (String) taskDetails.get('Subject');
        newTask.ActivityDate = Date.valueOf((String) taskDetails.get('DueDate'));
        newTask.Priority = (String) taskDetails.get('Priority');
        newTask.Status = 'Not Started';
        newTask.OwnerId = UserInfo.getUserId();
        insert newTask;
    }
}