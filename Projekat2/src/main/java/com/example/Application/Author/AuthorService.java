package com.example.Application.Author;

import com.example.Application.Country.Country;
import com.example.Application.Country.CountryController;
import com.example.Application.Country.CountryRepository;
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
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;
    @Autowired
    AuthorModelAssembler assembler;
    @Autowired
    CountryRepository countryRepository;

    public CollectionModel<EntityModel<Author>> GetAll() {
        List<EntityModel<Author>> authors = authorRepository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return new CollectionModel<>(authors,
                linkTo(methodOn(AuthorController.class).GetAll()).withSelfRel());
    }

    public ResponseEntity<EntityModel<Author>> GetById(Integer id) {

        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("author", id));

        return ResponseEntity
                .ok()
                .body(assembler.toModel(author));
    }

    public ResponseEntity<EntityModel<Author>> Add(Author newAuthor) {
        Integer countryId = newAuthor.getCountry().getId();
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new NotFoundException("country", countryId));

        newAuthor.setCountry(country);

        EntityModel<Author> entityModel = assembler.toModel(authorRepository.save(newAuthor));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    public ResponseEntity<EntityModel<Author>> Update(Author newAuthor, Integer id) {
        Integer countryId = newAuthor.getCountry().getId();
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new NotFoundException("country", countryId));

        Author updatedAuthor = authorRepository.findById(id)
                .map(author -> {
                    author.setFirstName(newAuthor.getFirstName());
                    author.setLastName(newAuthor.getLastName());
                    author.setBirthDate(newAuthor.getBirthDate());
                    author.setCountry(country);
                    return authorRepository.save(author);
                })
                .orElseGet(() -> {
                    newAuthor.setId(id);
                    return authorRepository.save(newAuthor);
                });

        EntityModel<Author> entityModel = assembler.toModel(updatedAuthor);

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    public ResponseEntity<EntityModel<Author>> Delete(Integer id) {

        authorRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
