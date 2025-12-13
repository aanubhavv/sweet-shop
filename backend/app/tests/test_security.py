from app.core.security import hash_password, verify_password


def test_password_is_hashed():
    password = "secret123"
    hashed = hash_password(password)

    assert hashed != password
    assert hashed.startswith("$argon2")


def test_verify_password_success():
    password = "secret123"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_password_failure():
    hashed = hash_password("secret123")

    assert verify_password("wrongpassword", hashed) is False
