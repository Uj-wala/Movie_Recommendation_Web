from fastapi import HTTPException

from sqlalchemy.orm import Session
 
from app.models.parent_profile_model import ParentProfile

from app.models.parent_child_model import ParentChild

from app.models.user_model import User

from app.models.student_profile_model import StudentProfile

from app.models.role_model import Role
from app.schemas.parent_profile_schema import ParentPasswordUpdate
from app.core.security import verify_password, hash_password
 
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
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "relationship_type": parent_profile.relationship_type,
        "profile_image_url": current_user.profile_image_url,

        "children": [

            {

                "id": child.id,

                "student_reference_id": child.student.id,
                
                "registration_number": child.student.registration_number,

                "child_name": child.student.full_name,

                "grade": child.student.student_profile.grade if child.student.student_profile else None,

                "school_name": child.student.student_profile.school_name if child.student.student_profile else None

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

    # Update relationship type and full name
    parent_profile.relationship_type = data.relationship_type
    current_user.full_name = data.full_name

    # Update email only if provided
    if data.email:
        email = data.email.strip().lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        current_user.email = email

    # Update phone number only if provided
    if data.phone_number:
        phone_number = f"+{data.phone_number}"

        existing_phone_user = (
            db.query(User)
            .filter(
                User.phone_number == phone_number,
                User.id != current_user.id
            )
            .first()
        )

        if existing_phone_user:
            raise HTTPException(
                status_code=400,
                detail="Phone number already exists"
            )

        current_user.phone_number = phone_number

    db.commit()

    return {
        "message": "Parent profile updated successfully"
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
            User.registration_number == data.student_registration_number
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
            ParentChild.student_id == student_user.id
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
            ParentChild.student_id
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
        student_id=student_user.id
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
            ParentChild.student_id == child_id,
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
    
    
def update_parent_password_service(
    db: Session,
    current_user: User,
    password_update: ParentPasswordUpdate,
) -> dict:

    user = (
        db.query(User)
        .filter(
            User.id == current_user.id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        password_update.current_password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    if (
        password_update.new_password
        != password_update.confirm_password
    ):
        raise HTTPException(
            status_code=400,
            detail="New password and confirm password do not match"
        )

    if (
        password_update.current_password
        == password_update.new_password
    ):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password"
        )

    user.password_hash = hash_password(
        password_update.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }
    
    
def get_parent_dashboard_service(
    db: Session,
    current_user
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

    parent_child = (
        db.query(ParentChild)
        .filter(
            ParentChild.parent_profile_id
            == parent_profile.id
        )
        .first()
    )

    if not parent_child:
        raise HTTPException(
            status_code=404,
            detail="Child not found"
        )

    student = (
        db.query(User)
        .filter(
            User.id == parent_child.student_id
        )
        .first()
    )

    student_profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.user_id
            == student.id
        )
        .first()
    )

    return {
        "parent_id": parent_profile.id,
        "parent_name": current_user.full_name,
        "parent_email": current_user.email,
        "parent_phone_number": current_user.phone_number,
        "profile_image_url": current_user.profile_image_url,
        "child": {
            "id": student.id,
            "name": student.full_name,
            "registration_number":
                student.registration_number,
            "grade":
                student_profile.grade,
            "school_name":
                student_profile.school_name
        },
        "progress": {
            "course_completion_percentage": 0
        },
        "tests": {
            "pending": 0,
            "ongoing": 0,
            "completed": 0
        }
    }    
    
    
def get_student_details_service(
    registration_number: str,
    db: Session
):

    student = (
        db.query(User)
        .filter(
            User.registration_number
            == registration_number
        )
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    role = (
        db.query(Role)
        .filter(
            Role.id == student.role_id
        )
        .first()
    )

    if (
        not role
        or role.name.lower() != "student"
    ):
        raise HTTPException(
            status_code=400,
            detail="User is not a student"
        )

    student_profile = (
        db.query(StudentProfile)
        .filter(
            StudentProfile.user_id
            == student.id
        )
        .first()
    )
    
    if(not student_profile):
        raise HTTPException(
            status_code=400,
            detail="Student profile not found"
        )

    return {
        "id": student.id,
        "student_reference_id": student.id,
        "registration_number":
            student.registration_number,
        "child_name":
            student.full_name,
        "grade":
            student_profile.grade
            if student_profile
            else None,
        "school_name":
            student_profile.school_name
            if student_profile
            else None
    }
