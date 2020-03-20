package com.example.Application.Country;

import com.example.Application.ExceptionClasses.BadRequestException;
import com.example.Application.ExceptionClasses.InternalServerException;
import com.example.Application.ExceptionClasses.NotFoundException;
import com.example.Application.Genre.Genre;
import com.example.Application.Genre.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/countries")
public class CountryController {

    @Autowired
    CountryService countryService;

    @GetMapping()
    CollectionModel<EntityModel<Country>> GetAll() {
        try {
            return countryService.GetAll();
        }
        catch (Exception ex) {
            throw new InternalServerException();
        }
    }

    @GetMapping("/{id}")
    ResponseEntity<EntityModel<Country>> GetById(@PathVariable Integer id) {
        try {
            return countryService.GetById(id);
        }
        catch (NotFoundException ex) {
            throw ex;
        }
        catch (Exception ex) {
            throw new InternalServerException();
        }
    }

    @PostMapping()
    ResponseEntity<EntityModel<Country>> AddCountry(@RequestBody Country newCountry) throws URISyntaxException {

        try {
            return countryService.AddCountry(newCountry);
        }
        catch (ConstraintViolationException ex) {

            throw new BadRequestException(ex.getMessage());
        }
        catch (Exception ex) {
            throw new InternalServerException();
        }
    }

    @PutMapping("/{id}")
    ResponseEntity<EntityModel<Country>> ModifyCountry(@RequestBody Country newCountry, @PathVariable Integer id) throws URISyntaxException {
        try {
            return countryService.ModifyCountry(newCountry, id);
        }
        catch (ConstraintViolationException ex) {

            throw new BadRequestException(ex.getMessage());
        }
        catch (Exception ex) {
            throw new InternalServerException();
        }
    }

    @DeleteMapping("/{id}")
    ResponseEntity<EntityModel<Country>> DeleteCountry(@PathVariable Integer id) {
        try {
            return countryService.DeleteCountry(id);
        }
        catch (EmptyResultDataAccessException ex) {
            throw new NotFoundException("country", id);
        }
        catch (Exception ex) {
            throw new InternalServerException();
        }
    }
}
