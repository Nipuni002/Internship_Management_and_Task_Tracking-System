package com.internship.management.service;

import com.internship.management.dto.request.InternRequest;
import com.internship.management.dto.response.InternResponse;
import com.internship.management.enums.InternStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InternService {
    InternResponse createIntern(InternRequest request);
    InternResponse updateIntern(String id, InternRequest request);
    void deleteIntern(String id);
    InternResponse getInternById(String id);
    Page<InternResponse> getAllInterns(Pageable pageable, InternStatus status, String university, String degree, String search);
    InternResponse activateIntern(String id);
    InternResponse deactivateIntern(String id);
}
