from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.db.models.user import User

def create_comment(db: Session, comment: CommentCreate, task_id: int, owner: User):
    db_comment = Comment(
        **comment.dict(),
        task_id=task_id,
        owner_id=owner.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comment(db: Session, task_id: int, owner: User):
    db_comment = db.query(Comment).filter(
        Comment.task_id == task_id
    ).order_by(desc(Comment.created_at)).all()
    return db_comment
