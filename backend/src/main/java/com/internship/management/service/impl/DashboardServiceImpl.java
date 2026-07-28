package com.internship.management.service.impl;

import com.internship.management.dto.response.AdminDashboardResponse;
import com.internship.management.dto.response.InternDashboardResponse;
import com.internship.management.entity.DailyLog;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.entity.Submission;
import com.internship.management.entity.Task;
import com.internship.management.enums.InternStatus;
import com.internship.management.enums.ProjectStatus;
import com.internship.management.enums.TaskStatus;
import com.internship.management.exception.ResourceNotFoundException;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final InternRepository internRepository;
    private final ProjectRepository projectRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        long totalInterns = internRepository.count();
        long activeInterns = mongoTemplate.count(new Query(Criteria.where("status").is(InternStatus.ACTIVE)), Intern.class);
        long totalProjects = projectRepository.count();
        long activeProjects = mongoTemplate.count(new Query(Criteria.where("status").is(ProjectStatus.ACTIVE)), Project.class);
        long pendingTasks = mongoTemplate.count(new Query(Criteria.where("status").in(TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVISION_REQUIRED, TaskStatus.SUBMITTED)), Task.class);
        long completedTasks = mongoTemplate.count(new Query(Criteria.where("status").is(TaskStatus.COMPLETED)), Task.class);
        long overdueTasks = mongoTemplate.count(new Query(Criteria.where("deadline").lt(LocalDate.now()).and("status").ne(TaskStatus.COMPLETED)), Task.class);
        long revisionRequiredTasks = mongoTemplate.count(new Query(Criteria.where("status").is(TaskStatus.REVISION_REQUIRED)), Task.class);

        // Fetch recent activities (Submissions & Daily logs)
        List<AdminDashboardResponse.RecentActivity> activities = new ArrayList<>();

        // Latest 5 submissions
        Query subQuery = new Query().with(Sort.by(Sort.Direction.DESC, "submittedAt")).limit(5);
        List<Submission> subList = mongoTemplate.find(subQuery, Submission.class);
        for (Submission sub : subList) {
            String title = "New task submission received";
            Task task = mongoTemplate.findById(sub.getTaskId(), Task.class);
            if (task != null) {
                Intern intern = mongoTemplate.findById(task.getAssignedInternId(), Intern.class);
                if (intern != null) {
                    title = intern.getFirstName() + " " + intern.getLastName() + " submitted task: " + task.getTitle();
                } else {
                    title = "Task submitted: " + task.getTitle();
                }
            }
            activities.add(AdminDashboardResponse.RecentActivity.builder()
                    .type("SUBMISSION")
                    .title(title)
                    .timestamp(sub.getSubmittedAt())
                    .build());
        }

        // Latest 5 daily logs
        Query logQuery = new Query().with(Sort.by(Sort.Direction.DESC, "createdAt")).limit(5);
        List<DailyLog> logList = mongoTemplate.find(logQuery, DailyLog.class);
        for (DailyLog log : logList) {
            String title = "New daily work log created";
            Intern intern = mongoTemplate.findById(log.getInternId(), Intern.class);
            if (intern != null) {
                title = intern.getFirstName() + " " + intern.getLastName() + " logged " + log.getHoursWorked() + " hours";
            }
            activities.add(AdminDashboardResponse.RecentActivity.builder()
                    .type("DAILY_LOG")
                    .title(title)
                    .timestamp(log.getCreatedAt())
                    .build());
        }

        // Sort combined list desc and take top 5
        activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));
        if (activities.size() > 5) {
            activities = activities.subList(0, 5);
        }

        return AdminDashboardResponse.builder()
                .totalInterns(totalInterns)
                .activeInterns(activeInterns)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .overdueTasks(overdueTasks)
                .revisionRequiredTasks(revisionRequiredTasks)
                .recentActivities(activities)
                .build();
    }

    @Override
    public InternDashboardResponse getInternDashboard() {
        Intern intern = getCurrentIntern();
        String internId = intern.getId();

        long assignedProjects = mongoTemplate.count(new Query(Criteria.where("assignedInternIds").is(internId)), Project.class);
        long assignedTasks = mongoTemplate.count(new Query(Criteria.where("assignedInternId").is(internId)), Task.class);
        long pendingTasks = mongoTemplate.count(new Query(Criteria.where("assignedInternId").is(internId).and("status").in(TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVISION_REQUIRED, TaskStatus.SUBMITTED)), Task.class);
        long completedTasks = mongoTemplate.count(new Query(Criteria.where("assignedInternId").is(internId).and("status").is(TaskStatus.COMPLETED)), Task.class);

        // Fetch latest feedback (Submission or Task)
        String latestFeedback = "No feedback received yet";
        List<Task> internTasks = mongoTemplate.find(new Query(Criteria.where("assignedInternId").is(internId)), Task.class);
        if (!internTasks.isEmpty()) {
            List<String> taskIds = internTasks.stream().map(Task::getId).toList();
            Query feedbackQuery = new Query(Criteria.where("taskId").in(taskIds).and("feedback").nin(null, ""));
            feedbackQuery.with(Sort.by(Sort.Direction.DESC, "submittedAt")).limit(1);
            List<Submission> feedbackSubmissions = mongoTemplate.find(feedbackQuery, Submission.class);
            if (!feedbackSubmissions.isEmpty()) {
                latestFeedback = feedbackSubmissions.get(0).getFeedback();
            } else {
                Query taskFeedbackQuery = new Query(Criteria.where("assignedInternId").is(internId).and("feedback").nin(null, ""));
                taskFeedbackQuery.with(Sort.by(Sort.Direction.DESC, "updatedAt")).limit(1);
                List<Task> feedbackTasks = mongoTemplate.find(taskFeedbackQuery, Task.class);
                if (!feedbackTasks.isEmpty()) {
                    latestFeedback = feedbackTasks.get(0).getFeedback();
                }
            }
        }

        // Daily Work Log Aggregation (Sum hours worked)
        long totalLogs = mongoTemplate.count(new Query(Criteria.where("internId").is(internId)), DailyLog.class);
        double totalHours = 0.0;

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("internId").is(internId)),
                Aggregation.group().sum("hoursWorked").as("totalHours")
        );
        AggregationResults<org.bson.Document> results = mongoTemplate.aggregate(aggregation, "daily_logs", org.bson.Document.class);
        if (!results.getMappedResults().isEmpty()) {
            Number sum = (Number) results.getMappedResults().get(0).get("totalHours");
            if (sum != null) {
                totalHours = sum.doubleValue();
            }
        }

        InternDashboardResponse.DailyLogSummary logSummary = InternDashboardResponse.DailyLogSummary.builder()
                .totalLogsSubmitted(totalLogs)
                .totalHoursWorked(totalHours)
                .build();

        return InternDashboardResponse.builder()
                .assignedProjects(assignedProjects)
                .assignedTasks(assignedTasks)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .latestFeedback(latestFeedback)
                .dailyLogSummary(logSummary)
                .build();
    }

    private Intern getCurrentIntern() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return internRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Intern record not found for email: " + email));
    }
}
