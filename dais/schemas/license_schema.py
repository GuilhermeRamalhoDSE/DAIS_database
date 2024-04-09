from datetime import date
from typing import Optional  
from pydantic import BaseModel

class LicenseBaseSchema(BaseModel):
    name: str
    email: str
    address: Optional[str] = None
    tel: Optional[str] = None
    license_code: str
    active: bool
    start_date: date
    end_date: date

class LicenseCreateSchema(LicenseBaseSchema):
    pass

class LicenseUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    tel: Optional[str] = None
    license_code: Optional[str] = None
    active: Optional[bool] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class LicenseSchema(LicenseBaseSchema):
    id: int

    class Config:
        from_attributes = True
