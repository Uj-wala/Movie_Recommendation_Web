from fastapi import HTTPException

from sqlalchemy.orm import Session
 
from app.models.parent_profile_model import ParentProfile

from app.models.parent_child_model import ParentChild

from app.models.user_model import User

from app.models.student_profile_model import StudentProfile

from app.models.role_model import Role
 
def get_parent_profile(

    current_user,

    db: Session

):
 
    parent_profile = (

        db.query(ParentProfile)

        .filter(

            ParentProfile.user_id == current_user.id

        )

        .first()

    )
 
    if not parent_profile:

        raise HTTPException(

            status_code=404,

            detail="Parent profile not found"

        )
 
    return {

        "parent_profile_id": parent_profile.id,

        "relationship_type": parent_profile.relationship_type,
        "profile_image_url": current_user.profile_image_url,

        "children": [

            {

                "id": child.id,

                "student_reference_id": child.student_reference_id,

                "child_name": child.child_name,

                "grade": child.grade,

                "school_name": child.school_name

            }

            for child in parent_profile.children

        ]

    }
 
def update_parent_profile(
    data,
    current_user,
    db: Session
):
 
    parent_profile = (

        db.query(ParentProfile)

        .filter(

            ParentProfile.user_id == current_user.id

        )

        .first()

    )
 
    if not parent_profile:

        raise HTTPException(

            status_code=404,

            detail="Parent profile not found"

        )
 
    parent_profile.relationship_type = (

        data.relationship_type

    )
 
    db.commit()
 
    return {

        "message":

        "Parent profile updated successfully"

    }
 

def add_child(
    data,
    current_user,
    db: Session
):
 
    parent_profile = (
        db.query(ParentProfile)
        .filter(
            ParentProfile.user_id == current_user.id
        )
        .first()
    )
 
    if not parent_profile:
        raise HTTPException(
            status_code=404,
            detail="Parent profile not found"
        )
 
    student_user = (
        db.query(User)
        .filter(
            User.id == data.student_reference_id
        )
        .first()
    )
 
    if not student_user:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )
 
    student_role = (
        db.query(Role)
        .filter(
            Role.id == student_user.role_id
        )
        .first()
    )
 
    if (
        not student_role
        or student_role.name.lower() != "student"
    ):
        raise HTTPException(
            status_code=400,
            detail="User is not a student"
        )
 
    student_profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.user_id ==
            student_user.id
        )
        .first()
    )
 
    if not student_profile:
        raise HTTPException(
            status_code=400,
            detail="Student profile not found"
        )
    
    # Check if the student is already linked to another parent
    already_linked_parent = (
        db.query(ParentChild)
        .filter(
            ParentChild.student_reference_id == student_user.id
        )
        .first()
    )

    if already_linked_parent:
        raise HTTPException(
            status_code=400,
            detail="Student is already linked to another parent"
        )
 
    existing_child = (
        db.query(ParentChild)
        .filter(
            ParentChild.parent_profile_id
            == parent_profile.id,
            ParentChild.student_reference_id
            == student_user.id
        )
        .first()
    )
 
    if existing_child:
        raise HTTPException(
            status_code=400,
            detail="Child already linked"
        )
 
    child = ParentChild(
        parent_profile_id=parent_profile.id,
        student_reference_id=student_user.id,
        child_name=student_user.full_name,
        grade=student_profile.grade,
        school_name=student_profile.school_name
    )
 
    db.add(child)
 
    db.commit()
 
    return {
        "message":
        "Child added successfully"
    }



def remove_child(
    child_id: str,
    current_user,
    db: Session
):
 
    parent_profile = (
        db.query(ParentProfile)
        .filter(
            ParentProfile.user_id ==
            current_user.id
        )
        .first()
    )
 
    if not parent_profile:
        raise HTTPException(
            status_code=404,
            detail="Parent profile not found"
        )
 
    child = (
        db.query(ParentChild)
        .filter(
            ParentChild.id == child_id,
            ParentChild.parent_profile_id
            == parent_profile.id
        )
        .first()
    )
 
    if not child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )
 
    db.delete(child)
 
    db.commit()
 
    return {
        "message":
        "Child removed successfully"
    }