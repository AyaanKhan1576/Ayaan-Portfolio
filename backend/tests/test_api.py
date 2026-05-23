from fastapi.testclient import TestClient
from app.main import create_app


client = TestClient(create_app())


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analytics_accepts_without_supabase():
    response = client.post("/api/analytics/events", json={"eventType": "visit", "metadata": {"source": "test"}})
    assert response.status_code == 200
    assert response.json()["accepted"] is True


def test_object_interaction_analytics_event_is_supported():
    response = client.post(
        "/api/analytics/events",
        json={"eventType": "object_interaction", "metadata": {"objectId": "desk"}},
    )
    assert response.status_code == 200
    assert response.json()["accepted"] is True


def test_contact_accepts_subject_without_supabase():
    response = client.post(
        "/api/contact",
        json={
            "name": "Ayaan",
            "email": "ayaan@example.com",
            "subject": "Portfolio",
            "message": "Hello from the room.",
        },
    )
    assert response.status_code == 200
    assert response.json()["accepted"] is True


def test_resume_unavailable_when_not_configured():
    response = client.get("/api/resume/download", follow_redirects=False)
    assert response.status_code == 503
