import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class NewPost(BaseModel):
    content: str

class Post(BaseModel):
    id: str
    content: str
    date: str

posts: List[Post] = []

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/posts", response_model=List[Post])
async def read_posts():
    return posts

@app.post("/posts", status_code=201)
async def create_post(post: NewPost):
    post = Post(id=str(uuid4()), content=post.content, date="2021-01-01")
    posts.append(post)
    return {"message": "Post added successfully"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app"
    )
