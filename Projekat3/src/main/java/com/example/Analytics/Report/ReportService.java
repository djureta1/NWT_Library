package com.example.Analytics.Report;

import com.example.Analytics.Employee.Employee;
import com.example.Analytics.Employee.EmployeeRepository;
import com.example.Analytics.ReportType.ReportType;
import com.example.Analytics.ReportType.ReportTypeRepository;
import com.example.Analytics.ExceptionClass.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class ReportService {

    @Autowired
    ReportRepository reportRepository;
    @Autowired
    ReportModelAssembler assembler;
    @Autowired
    ReportTypeRepository reportTypeRepository;
    @Autowired
    EmployeeRepository employeeRepository;

    public ResponseEntity<EntityModel<Report>> GetById(Integer id) {
        Report report = reportRepository.findById(id).orElseThrow(()->new NotFoundException("report",id));
        return ResponseEntity.ok().body(assembler.toModel(report));
    }

    public CollectionModel<EntityModel<Report>> GetAll() {
        List<EntityModel<Report>> reports = reportRepository.findAll().stream().map(assembler::toModel).collect(Collectors.toList());
        return new CollectionModel<>(reports, linkTo(methodOn(ReportController.class).GetAll()).withSelfRel());
    }

    public ResponseEntity<EntityModel<Report>> Add(Report newReport) {
        Integer reportTypeId = newReport.getReportType().getId();
        ReportType reportType = reportTypeRepository.findById(reportTypeId).orElseThrow(()->new NotFoundException("report_type", reportTypeId));
        newReport.setReportType(reportType);

        Integer employeeId = newReport.getEmployee().getId();
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(()->new NotFoundException("employee_id",employeeId));
        newReport.setEmployee(employee);

        EntityModel<Report> entityModel = assembler.toModel(reportRepository.save(newReport));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    public ResponseEntity<EntityModel<Report>> Update(Report newReport, Integer id) {
        Integer reportTypeId = newReport.getReportType().getId();
        ReportType reportType = reportTypeRepository.findById(reportTypeId).orElseThrow(()->new NotFoundException("report_type", reportTypeId));

        Integer employeeId = newReport.getEmployee().getId();
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(()->new NotFoundException("employee_id",employeeId));

        Report updatedReport = reportRepository.findById(id)
                .map(report -> {report.setReportType(reportType);
                                report.setCreationDate(newReport.getCreationDate());
                                report.setEmployee(employee);
                                report.setPath(newReport.getPath());
                                return reportRepository.save(report);
        }).orElseThrow(()->new NotFoundException("reports",id));

        EntityModel<Report> entityModel = assembler.toModel(updatedReport);
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    public ResponseEntity<EntityModel<Report>> Delete(Integer id) {
        reportRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
