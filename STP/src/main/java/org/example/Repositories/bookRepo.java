package org.example.Repositories;

import org.example.Entities.book;
import org.springframework.data.repository.CrudRepository;

public interface bookRepo extends CrudRepository<book, Long> {
}
