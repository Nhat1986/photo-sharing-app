
DELETE FROM Images;


INSERT INTO Images (id, owner, albumid, description, "order", thumbnailUrl, imageUrl, widthpx, heightpx, createdAt) 
VALUES ('f1', 'user1', 'album1', 'LAFAYETTE', 1, 'https://example.com/image.jpg', 'https://example.com/image.jpg', 500, 500, CURRENT_TIMESTAMP);

INSERT INTO Images (id, owner, albumid, description, "order", thumbnailUrl, imageUrl, widthpx, heightpx, createdAt) 
VALUES ('f2', 'user1', 'album1', 'EFFEL TOWER', 1, 'https://example.com/image.jpg', 'https://example.com/image.jpg', 500, 500, CURRENT_TIMESTAMP);

INSERT INTO Images (id, owner, albumid, description, "order", thumbnailUrl, imageUrl, widthpx, heightpx, createdAt) 
VALUES ('f3', 'user1', 'album1', 'Cafes', 1, 'https://example.com/image.jpg', 'https://example.com/image.jpg', 500, 500, CURRENT_TIMESTAMP);

INSERT INTO Images (id, owner, albumid, description, "order", thumbnailUrl, imageUrl, widthpx, heightpx, createdAt) 
VALUES ('f4', 'user1', 'album1', 'Triomphe', 1, 'https://example.com/image.jpg', 'https://example.com/image.jpg', 500, 500, CURRENT_TIMESTAMP);

INSERT INTO Images (id, owner, albumid, description, "order", thumbnailUrl, imageUrl, widthpx, heightpx, createdAt) 
VALUES ('f5', 'user1', 'album1', 'La Seine', 1, 'https://example.com/image.jpg', 'https://example.com/image.jpg', 500, 500, CURRENT_TIMESTAMP);

UPDATE Albums 
SET name = 'French Architecture', 
    description = 'Photos from our tour of the city of Paris & outer France! Beginning in Paris, through to Lyon & ending at Nice!' ,
    numImages = 5
WHERE id = 'album1';
