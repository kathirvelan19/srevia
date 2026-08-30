package com.sreviaherbs.repository;

import com.sreviaherbs.model.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends MongoRepository<ContactMessage, String> {
}
