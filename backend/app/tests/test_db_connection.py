from app.db.mongo import get_client, get_database


def test_database_connection():
    client = get_client()
    db = get_database(client)

    assert db.name == "sweet_shop"

    client.close()
