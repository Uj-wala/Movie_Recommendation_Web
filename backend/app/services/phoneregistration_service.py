from sqlalchemy.orm import Session
from fastapi import HTTPException
from passlib.context import CryptContext
from app.core.security import hash_password, hash_security_answer
from app.models.user_model import User
from app.models.student_profile_model import StudentProfile
from app.models.parent_profile_model import ParentProfile
from app.models.teacher_profile_model import TeacherProfile
from app.core.enums import SecurityQuestion
from app.schemas.user_schema import (
    RegisterRequest,
    ConfirmRoleRequest,
    StudentDetailsRequest,
    ParentVerificationRequest,
)
from app.schemas.teacher_profile_schema import TeacherProfileCreateRequest
from app.models.parent_child_model import ParentChild
from app.models.subject_model import Subject
from app.models.teacher_subject_model import TeacherSubject
from app.models.role_model import Role
from app.utils.registration_number_util import (
    generate_registration_number,
)  
 
def register_by_phone(data: RegisterRequest, db: Session):
 
    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )
 
   
    phone = data.phone_number
    if phone and not phone.startswith("+"):
        phone = f"+{phone}"
 
    existing_user = db.query(User).filter(
        User.phone_number == phone
    ).first()
 
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="This phone number is already registered"
        )
       
    roles = (
        db.query(Role)
        .filter(Role.name == "student")
        .order_by(Role.name)
        .first()
    )    
 
    new_user = User(
        full_name=data.full_name,
        phone_number=phone,
        email=None,
        password_hash=hash_password(data.password),
        security_question=SecurityQuestion(data.security_question),
        security_answer_hash=hash_security_answer(data.security_answer),
        role_id=roles.id if roles else None,
        failed_login_attempts=0,
        is_active=True,
        is_verified=False,
        profile_completed=False,
        country_id=data.country_id
    )
 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
 
    return new_user
 
 
def confirm_role(data: ConfirmRoleRequest, db: Session):
 
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()
 
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
   
    new_role = db.query(Role).filter(
        Role.id == data.role_id
    ).first()
 
    if not new_role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )
 
    # Allow only one admin
    if new_role.name.lower() == "admin":
 
        existing_admin = (
            db.query(User)
            .join(Role, User.role_id == Role.id)
            .filter(Role.name == "admin")
            .first()
        )
 
        if existing_admin:
            raise HTTPException(
                status_code=400,
                detail="Admin already exists. Only one admin is allowed."
            )
 
    user.role_id = data.role_id
    new_role = db.query(Role).filter(Role.id == data.role_id).first()
    if new_role:
        user.registration_number = generate_registration_number(db, new_role.name)  
    db.commit()
    db.refresh(user)
 
    return {
        "message": "Role confirmed successfully",
        "user_id": user.id,
        "role_id": user.role_id,
        "registration_number": user.registration_number
    }
 
 
def save_student_details(data: StudentDetailsRequest, db: Session):
 
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()
 
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
 
    existing_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == data.user_id
    ).first()
 
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Student profile already exists"
        )
 
    student_profile = StudentProfile(
        user_id=data.user_id,
        grade=data.grade,
        workplace=data.work_place,
        school_name=data.school_name
    )
 
    db.add(student_profile)
    user.profile_completed = True
    db.commit()
    db.refresh(student_profile)
 
    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id,
        "student_id": student_profile.id
    }
 
 
def save_parent_verification(data: ParentVerificationRequest, db: Session):
 
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()
 
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
 
    existing_profile = db.query(ParentProfile).filter(
        ParentProfile.user_id == data.user_id
    ).first()
 
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Parent profile already exists"
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
 
    parent_profile = ParentProfile(
    user_id=data.user_id
    )
 
    db.add(parent_profile)
    db.flush()
   
    parent_child = ParentChild(
    parent_profile_id=parent_profile.id,
    student_id=student_user.id
    )
 
    db.add(parent_child)
    user.profile_completed = True
    db.commit()
    db.refresh(parent_profile)
 
    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id,
        "parent_id": parent_profile.id
    }
 
 
def save_teacher_verification(
    data: TeacherProfileCreateRequest,
    db: Session
):
 
    user = db.query(User).filter(
        User.id == data.user_id
    ).first()
 
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
 
    existing_profile = db.query(
        TeacherProfile
    ).filter(
        TeacherProfile.user_id == data.user_id
    ).first()
 
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Teacher profile already exists"
        )
 
    teacher_profile = TeacherProfile(
        user_id=data.user_id,
        school_name=data.school_name
    )
 
    db.add(teacher_profile)
 
    db.flush()
   
    if len(data.subject_ids) != len(set(data.subject_ids)):
        raise HTTPException(
            status_code=400,
            detail="Duplicate subjects are not allowed"
        )
   
    subjects = (
        db.query(Subject)
        .filter(
            Subject.id.in_(data.subject_ids)
        )
        .all()
    )
 
    if len(subjects) != len(data.subject_ids):
        raise HTTPException(
            status_code=400,
            detail="One or more subjects are invalid"
        )
 
    for subject_id in data.subject_ids:
 
        teacher_subject = TeacherSubject(
            teacher_profile_id=teacher_profile.id,
            subject_id=subject_id
        )
 
        db.add(teacher_subject)
        user.profile_completed = True
 
    db.commit()
    db.refresh(teacher_profile)
 
    return {
        "message": "Registration successful! You can now access the Dashboard.",
        "user_id": data.user_id,
        "teacher_id": teacher_profile.id
    }