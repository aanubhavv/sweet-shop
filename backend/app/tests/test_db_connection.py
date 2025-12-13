from app.db.mongo import get_database

def test_database_connection():
    db = get_database()
    assert db.name == "sweet_shop"
