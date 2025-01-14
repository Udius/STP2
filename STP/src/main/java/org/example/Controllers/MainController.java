package org.example.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.example.Repositories.readerRepo;
import org.example.Entities.reader;

@Controller
public class MainController {
    @Autowired
    private readerRepo readerRep;

    @GetMapping("/")
    public String mainMenu() {
        return "MainMenu.html";
    }

    @GetMapping("/readers")
    public String readers() {
        return "Reader.html";
    }

    @GetMapping("/books")
    public String books() {
        return "Book.html";
    }

    @GetMapping("/readersHistory")
    public String readersHistory() {
        return "ReaderHistory.html";
    }
}
