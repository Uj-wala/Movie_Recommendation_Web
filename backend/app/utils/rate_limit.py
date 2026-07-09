import time
from collections import defaultdict

from fastapi import HTTPException, Request, status

# ponytail: in-memory fixed-window limiter, single process only.
# Swap for slowapi/redis if you run multiple workers.
_hits: dict[str, list[float]] = defaultdict(list)


def rate_limit(key: str, max_calls: int = 5, window_seconds: int = 60) -> None:
    now = time.time()
    recent = [t for t in _hits[key] if now - t < window_seconds]
    if len(recent) >= max_calls:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests, please try again shortly",
        )
    recent.append(now)
    _hits[key] = recent


def limiter(request: Request, bucket: str, max_calls: int = 5, window_seconds: int = 60) -> None:
    client = request.client.host if request.client else "unknown"
    rate_limit(f"{bucket}:{client}", max_calls, window_seconds)
