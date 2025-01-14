package org.example.Controllers;

import lombok.SneakyThrows;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @SneakyThrows
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<?> DataAccessExceptionF(DataAccessException error) {
        if (error.getMessage().contains("ОШИБКА:")) {
            String message = error.getMessage();
            message = message.split("ОШИБКА: ", 2)[1];
            message = message.split("\n", 2)[0];
            message = message.split("\n", 1)[0];

            SQLException ex = new SQLException(message);

            return new ResponseEntity<>(ex, HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @SneakyThrows
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<?> SQLExceptionF(SQLException e) {
        return new ResponseEntity<>(e, HttpStatus.BAD_REQUEST);
    }
}
