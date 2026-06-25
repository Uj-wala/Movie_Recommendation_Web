from pydantic import BaseModel
 
 
class DropdownResponse(BaseModel):
    id: str
    name: str
 
 
class CountryDropdownResponse(BaseModel):
    id: str
    name: str
    iso_code: str
    phone_code: str