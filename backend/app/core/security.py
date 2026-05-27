import time
from collections import defaultdict, deque
from collections.abc import Callable

from fastapi import HTTPException, Request, status


WINDOW_SECONDS = 60
_rate_buckets: dict[str, deque[float]] = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limiter(name: str, limit: int) -> Callable[[Request], None]:
    def dependency(request: Request) -> None:
        now = time.monotonic()
        key = f"{name}:{client_ip(request)}"
        bucket = _rate_buckets[key]
        while bucket and now - bucket[0] > WINDOW_SECONDS:
            bucket.popleft()
        if len(bucket) >= limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Request failed")
        bucket.append(now)

    return dependency


def truncate_user_agent(value: str | None) -> str | None:
    return value[:180] if value else None


def security_headers() -> dict[str, str]:
    return {
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    }
