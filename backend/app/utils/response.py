"""Reusable helpers for the standard API envelope: {success, message, data|errors}.

Success responses are wrapped automatically by middleware in main.py, so routes
can keep returning plain data. `failure` is used by the exception handlers.
"""
from typing import Any


def success(data: Any = None, message: str = "OK") -> dict:
    return {"success": True, "message": message, "data": data}


def failure(message: str, errors: list | None = None) -> dict:
    # `detail` is kept as an alias so existing clients reading `.detail` still work.
    return {"success": False, "message": message, "detail": message, "errors": errors or []}
