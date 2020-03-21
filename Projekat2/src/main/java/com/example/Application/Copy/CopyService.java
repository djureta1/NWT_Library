package com.example.Application.Copy;

import com.example.Application.Country.CountryController;
import com.example.Application.ExceptionClasses.NotFoundException;
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
public class CopyService {
    @Autowired
    private CopyRepository copyRepository;
    @Autowired
    CopyModelAssembler assembler;

    public CollectionModel<EntityModel<Copy>> GetAll() {
        List<EntityModel<Copy>> copies = copyRepository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(copies,
                linkTo(methodOn(CountryController.class).GetAll()).withSelfRel());
    }

    public ResponseEntity<EntityModel<Copy>> GetById(Integer id) {

        Copy copy = copyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("copy", id));

        return ResponseEntity
                .ok()
                .body(assembler.toModel(copy));
    }

    public ResponseEntity<EntityModel<Copy>> Add(Copy newCopy) {
        EntityModel<Copy> entityModel = assembler.toModel(copyRepository.save(newCopy));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    public ResponseEntity<EntityModel<Copy>> Update(Copy newCopy, Integer id) {
        Copy updatedCopy = copyRepository.findById(id)
                .map(copy -> {
                    copy.setBookName(newCopy.getBookName());
                    return copyRepository.save(copy);
                })
                .orElseGet(() -> {
                    newCopy.setId(id);
                    return copyRepository.save(newCopy);
                });

        EntityModel<Copy> entityModel = assembler.toModel(updatedCopy);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    public ResponseEntity<EntityModel<Copy>> Delete(Integer id) {

        copyRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
