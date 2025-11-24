from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
import os
import shutil

# Clean up previous test
if os.path.exists("test_storage"):
    shutil.rmtree("test_storage")

print("Initializing Qdrant with local storage...")
try:
    client = QdrantClient(path="test_storage")
    
    collection_name = "test_collection"
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=4, distance=Distance.DOT),
    )
    
    print("Adding point...")
    client.upsert(
        collection_name=collection_name,
        points=[
            {
                "id": 1,
                "vector": [0.05, 0.61, 0.76, 0.74],
                "payload": {"city": "Berlin"}
            }
        ]
    )
    
    print("Verifying count...")
    count = client.count(collection_name=collection_name).count
    print(f"Count: {count}")
    
    if count == 1:
        print("SUCCESS: Persistence test passed (in-memory phase).")
    else:
        print("FAILURE: Count is wrong.")
        
    # Close client (if needed, though QdrantClient handles it)
    del client
    
    # Re-open
    print("Re-opening storage...")
    client2 = QdrantClient(path="test_storage")
    count2 = client2.count(collection_name=collection_name).count
    print(f"Count after reopen: {count2}")
    
    if count2 == 1:
        print("SUCCESS: Persistence verified.")
    else:
        print("FAILURE: Data lost after reopen.")

except Exception as e:
    print(f"ERROR: {e}")
