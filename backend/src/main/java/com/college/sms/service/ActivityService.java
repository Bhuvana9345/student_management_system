package com.college.sms.service;

import com.college.sms.entity.ActivityLog;
import com.college.sms.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ActivityService {
    private final ActivityLogRepository logs;
    public ActivityService(ActivityLogRepository logs) { this.logs = logs; }
    public void log(String action) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setActor("system");
        logs.save(log);
    }
    public List<ActivityLog> recent() { return logs.findTop8ByOrderByCreatedAtDesc(); }
}
