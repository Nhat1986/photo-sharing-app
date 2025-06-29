-- Migration number: 0004 	 2024-09-02T01:32:27.069Z

INSERT INTO Users (id,email, phone, firstName, lastName, dateOfBirth, 
                    subscription, profileImage, country, state)
VALUES ('user1','example1@example.com','0123456789','John','Citizen','2000-01-01',
        'FREE','https://example.com/image.jpg','Australia','VIC');

INSERT INTO Users (id,email, phone, firstName, lastName, dateOfBirth, 
                    subscription, profileImage, country, state)
VALUES ('user2','example2@example.com','0123456789','John','Citizen','2000-02-01',
        'FREE','https://example.com/image.jpg','Australia','NSW');

INSERT INTO Users (id,email, phone, firstName, lastName, dateOfBirth, 
                    subscription, profileImage, country, state)
VALUES ('user3','example3@example.com','0123456789','John','Citizen','2000-03-01',
        'FREE','https://example.com/image.jpg','Australia','VIC');


INSERT INTO Albums (id, owner, name, description, thumbnailUrl)
VALUES ('album1','user1','test album','a small album purely for testing','');

INSERT INTO Users (id,email, phone, firstName, lastName, dateOfBirth, 
                    subscription, profileImage, country, state)
VALUES ('user4','example4@example.com','0123456789','John','Citizen','2002-03-01',
        'FREE','https://example.com/image.jpg','Australia','VIC');

