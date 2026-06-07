CREATE TABLE chat_session (
                              id UUID PRIMARY KEY,
                              title VARCHAR(255),
                              created_at TIMESTAMP NOT NULL,
                              updated_at TIMESTAMP NOT NULL
);

CREATE TABLE chat_message (
                              id UUID PRIMARY KEY,
                              session_id UUID NOT NULL,
                              role VARCHAR(20) NOT NULL,
                              content TEXT NOT NULL,
                              created_at TIMESTAMP NOT NULL,

                              CONSTRAINT fk_chat_message_session
                                  FOREIGN KEY(session_id)
                                      REFERENCES chat_session(id)
);