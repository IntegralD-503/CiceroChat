from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import uuid


class Message(BaseModel):
    id = str(uuid.uuid4())
    msg: str
    timestamp = str(datetime.now())


class Chat(BaseModel):
    token: str
    messages: List[Message]
    session_start = str(datetime.now())

